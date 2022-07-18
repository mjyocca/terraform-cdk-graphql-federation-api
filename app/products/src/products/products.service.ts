import { Injectable } from '@nestjs/common';
import { ProductArgs } from './products.args';
import { Product } from './products.model';
import { InputType } from '@nestjs/graphql';

@InputType()
class NewProductsInput {}

@Injectable()
export class ProductService {

  async create(data: string): Promise<Product> {
    return {} as any;
  }

  async findOneById(id: string): Promise<Product> {
    return {} as any;
  }

  async findAll(productArgs: ProductArgs): Promise<Product[]> {
    return [] as Product[];
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}