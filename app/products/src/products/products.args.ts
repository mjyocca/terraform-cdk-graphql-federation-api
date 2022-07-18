import { ArgsType, Field } from '@nestjs/graphql'

@ArgsType()
export class ProductArgs {

  @Field(() => String)
  id: string
}