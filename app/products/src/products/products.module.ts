import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductsResolver } from './products.resolver';

@Module({
  providers: [ ProductService, ProductsResolver ],
  exports: [ ProductService ],
})
export class ProductModule {}