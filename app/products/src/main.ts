import 'reflect-metadata'
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { fastify } from 'fastify';
import type { FastifyServerOptions, FastifyInstance } from 'fastify'
import { Logger } from '@nestjs/common';

export default async function bootstrapServer() {
  const serverOptions: FastifyServerOptions = {logger: true}
  const instance: FastifyInstance = fastify(serverOptions);
  const nestApp = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance as any),
    {
      logger: !process.env.AWS_EXECUTION_ENV ? new Logger() : console
    }
  )
  await nestApp.init()
  return {
    app: nestApp,
    instance
  }
}

async function main() {
  try {
    const app = await bootstrapServer();
    app.instance.listen({ port: 4003 })
  } catch(err) {
    console.error(err)
  }
}

if (require.main === module) main()

