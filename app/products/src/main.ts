import 'reflect-metadata'
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { fastify } from 'fastify';
import type { FastifyInstance } from 'fastify'
import { Logger } from '@nestjs/common';

export interface NestApp {
  app: NestFastifyApplication;
  instance: FastifyInstance;
}

export default async function bootstrapServer(): Promise<NestApp> {
  const instance: FastifyInstance = fastify({logger: true});
  const adapter = new FastifyAdapter(instance as any)
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      logger: !process.env.AWS_EXECUTION_ENV ? new Logger() : console
    }
  )
  await app.init()
  return { app, instance }
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

