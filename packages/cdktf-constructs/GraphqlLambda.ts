import { Construct } from 'constructs';
import { AssetType, TerraformAsset, TerraformOutput } from 'cdktf';
import { S3Object } from '@cdktf/provider-aws/lib/s3';
import { IamRole, IamRolePolicyAttachment } from '@cdktf/provider-aws/lib/iam';
import { LambdaFunction, LambdaPermission, LambdaFunctionEnvironment } from '@cdktf/provider-aws/lib/lambdafunction';
import { Apigatewayv2Api } from '@cdktf/provider-aws/lib/apigatewayv2';
import * as random from '@cdktf/provider-random';

export interface GraphqlLambdaConfig {
  stageName: string;
  deploymentBucketName: string;
  version: string;
  path: string;
  handler: string;
  runtime: string;
  environment?: LambdaFunctionEnvironment;
}

const lambdaRolePolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Action: 'sts:AssumeRole',
      Principal: {
        Service: 'lambda.amazonaws.com',
      },
      Effect: 'Allow',
      Sid: '',
    },
  ],
};

export class GraphqlLambdaFunction extends Construct {
  lambdaFunction: LambdaFunction;
  api: Apigatewayv2Api;

  public static prefix = 'gql-cdktf';

  constructor(scope: Construct, name: string, config: GraphqlLambdaConfig) {
    super(scope, name);

    new random.RandomProvider(this, 'random');
    // Create random value
    const pet = new random.Pet(this, 'random-name', {
      length: 2,
    });

    const terraformAsset = new TerraformAsset(this, 'lambda-asset', {
      path: config.path,
      type: AssetType.ARCHIVE,
    });

    const lambdaArchive = new S3Object(this, 'lambda-archive', {
      bucket: config.deploymentBucketName,
      key: `${name}/${config.stageName}/${config.version}/${terraformAsset.fileName}`,
      source: terraformAsset.path, // returns a posix path
    });

    // Create Lambda role
    const role = new IamRole(this, 'lambda-exec', {
      name: `${GraphqlLambdaFunction.prefix}-${name}-${pet.id}`,
      assumeRolePolicy: JSON.stringify(lambdaRolePolicy),
    });

    // Add execution role for lambda to write to CloudWatch logs
    new IamRolePolicyAttachment(this, 'lambda-managed-policy', {
      policyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
      role: role.name,
    });

    // Create Lambda function
    this.lambdaFunction = new LambdaFunction(this, `${GraphqlLambdaFunction.prefix}-lambda`, {
      functionName: `${GraphqlLambdaFunction.prefix}-${name}-${pet.id}`,
      s3Bucket: config.deploymentBucketName,
      s3Key: lambdaArchive.key,
      handler: config.handler,
      runtime: config.runtime,
      role: role.arn,
      memorySize: 256,
      timeout: 8,
      environment: config.environment,
    });

    // Create and configure API gateway
    this.api = new Apigatewayv2Api(this, 'api-gw', {
      name: name,
      protocolType: 'HTTP',
      target: this.lambdaFunction.arn,
      routeKey: 'POST /graphql',
    });

    new LambdaPermission(this, 'apigw-lambda', {
      functionName: this.lambdaFunction.functionName,
      action: 'lambda:InvokeFunction',
      principal: 'apigateway.amazonaws.com',
      sourceArn: `${this.api.executionArn}/*/*`,
    });

    new TerraformOutput(this, 'url', {
      value: this.api.apiEndpoint,
    });

    new TerraformOutput(this, 'version', {
      value: config.version,
    });
  }
}
