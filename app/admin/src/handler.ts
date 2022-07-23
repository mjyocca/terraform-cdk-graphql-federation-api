import FastifyLambda from '@fastify/aws-lambda';
import admin from './index';

export const handler = FastifyLambda(admin);
