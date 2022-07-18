import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductArgs } from './products.args';
import { Product } from './products.model';
import { ProductService } from './products.service';

@Resolver((of: any) => Product)
export class ProductsResolver {
  constructor(private readonly productService: ProductService) {}

  @Query((returns) => Product)
  async product(@Args('id') id: string): Promise<Product> {
    const product = await this.productService.findOneById(id);
    if (!product) {
      throw new NotFoundException(id);
    }
    return product;
  }

  @Query((returns) => [Product])
  products(@Args() productArgs: ProductArgs): Promise<Product[]> {
    return this.productService.findAll(productArgs);
  }

  @Mutation((returns) => Product)
  async addProduct():
  Promise<Product> {
    const product = await this.productService.create("");
    return product;
  }

  @Mutation((returns) => Boolean)
  async removeProduct(@Args('id') id: string) {
    return this.productService.remove(id);
  }
}