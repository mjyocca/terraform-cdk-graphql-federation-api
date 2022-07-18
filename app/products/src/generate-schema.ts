import { ProductsResolver } from './products/products.resolver'
import { GraphQLSchemaBuilderModule, GraphQLSchemaFactory } from '@nestjs/graphql'
import { NestFactory } from '@nestjs/core'
import { printSchema } from 'graphql'

export async function generateSchema() {
  const schemaBuilderModule = await NestFactory.create(GraphQLSchemaBuilderModule)
  await schemaBuilderModule.init();

  const gqlSchemaFactory = schemaBuilderModule.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create([ProductsResolver]);
  console.log(printSchema(schema));
}
