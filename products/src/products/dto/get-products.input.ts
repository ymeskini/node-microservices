import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetProductsInput {
  @Field(() => [String], { nullable: true })
  categories?: string[];

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  name?: string;
}
