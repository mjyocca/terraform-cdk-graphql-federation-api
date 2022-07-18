import awsLambdaFastify from '@fastify/aws-lambda'
import type {Context, APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import bootstrapProducts from './main'

let cachedNestApp: any;

export const handler = async (event: APIGatewayProxyEvent, context: Context,): Promise<APIGatewayProxyResult> => {
  if (cachedNestApp) {
    cachedNestApp = await bootstrapProducts();
  }
  return awsLambdaFastify(cachedNestApp.instance)(event, context)
}
