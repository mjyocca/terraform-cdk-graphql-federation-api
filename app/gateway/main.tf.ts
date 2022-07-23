import * as path from 'path';
import { App, TerraformStack, TerraformOutput, DataTerraformRemoteStateLocal } from 'cdktf';
import * as aws from '@cdktf/provider-aws';
import { Construct } from 'constructs';
import { GraphqlLambdaFunction } from '@packages/cdktf-constructs';
import * as dotenv from 'dotenv-flow';
dotenv.config();

class GatewayApiStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const stage = process.env.STAGE || 'dev';

    new aws.AwsProvider(this, 'aws', {
      region: 'us-west-2',
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const remoteState = new DataTerraformRemoteStateLocal(this, 'remote-local', {
      path: path.resolve(`../../infrastructure/${stage}/terraform.tfstate`),
    });

    const adminRemoteState = new DataTerraformRemoteStateLocal(this, 'admin-api', {
      path: path.resolve(`../admin/terraform.admin-api.tfstate`),
    });

    const productsRemoteState = new DataTerraformRemoteStateLocal(this, 'products-api', {
      path: path.resolve(`../products/terraform.products-api.tfstate`),
    });

    const graphQLFunction = new GraphqlLambdaFunction(this, name, {
      deploymentBucketName: remoteState.getString('lambdaDeploymentBucket'),
      path: path.resolve(__dirname),
      handler: 'src/index.handler',
      runtime: 'nodejs14.x',
      stageName: stage,
      version: 'v0.0.3',
      environment: {
        variables: {
          GRAPHQL_ADMIN_API: adminRemoteState.getString('graphql-api'),
          GRAPHQL_PRODUCTS_API: productsRemoteState.getString('graphql-api'),
          STAGE: stage,
        },
      },
    });

    new TerraformOutput(this, 'graphql-api', {
      value: `${graphQLFunction.api.apiEndpoint}/graphql`,
      staticId: true,
    });
  }
}

const app = new App();

new GatewayApiStack(app, 'gateway-api');

app.synth();
