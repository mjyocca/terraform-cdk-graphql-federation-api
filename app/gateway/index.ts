import FastifyLambda from '@fastify/aws-lambda'
import gateway from './gateway'

export const handler = FastifyLambda(gateway)