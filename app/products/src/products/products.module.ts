import { Module } from '@nestjs/common';
import { GraphQLFederationFactory } from "@nestjs/graphql"
import { ProductService } from './products.service';
import { ProductsResolver } from './products.resolver';

@Module({
  providers: [ ProductService, ProductsResolver ],
  exports: [ ProductService ],
})
export class ProductModule {}