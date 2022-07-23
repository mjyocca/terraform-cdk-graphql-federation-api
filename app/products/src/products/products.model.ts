import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'product' })
export class Product {
  @Field((type) => ID)
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  creationDate: Date;

  @Field((type) => [String])
  ingredients: string[];
}
