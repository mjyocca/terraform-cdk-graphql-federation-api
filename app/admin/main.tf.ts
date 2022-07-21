import * as path from "path";
import { LambdaStack } from "@packages/cdktf-constructs";
import type { LambdaFunctionConfig  } from "@packages/cdktf-constructs"
import { App } from "cdktf";
import * as dotenv from "dotenv-flow";
dotenv.config()

const app = new App();

const lambdaConfig: LambdaFunctionConfig = {
  path: path.resolve(__dirname),
  handler: "src/handler.handler",
  runtime: "nodejs14.x",
  stageName: process.env.STAGE || 'dev',
  version: "v0.0.1",
  awsProviderConfig: {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY
  }
}

new LambdaStack(app, "admin-api", lambdaConfig);

app.synth()