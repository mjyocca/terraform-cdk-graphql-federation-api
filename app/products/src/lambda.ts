import 'reflect-metadata'
import awsLambdaFastify, { PromiseHandler, LambdaResponse } from '@fastify/aws-lambda'
import type {Context, APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import bootstrapServer from './main';
import type { NestApp } from './main';

let cachedNestApp: NestApp;
let cachedProxy: PromiseHandler<unknown, LambdaResponse>;

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  if (!cachedNestApp) {
    cachedNestApp = await bootstrapServer();
  }
  if (!cachedProxy) {
    cachedProxy = awsLambdaFastify(cachedNestApp.instance, {
      decorateRequest: true
    });
    await cachedNestApp.instance.ready();
  }
  return cachedProxy(event, context);
}
