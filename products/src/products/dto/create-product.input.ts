import { InputType, Field } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @MinLength(3)
  name: string;

  @Field(() => [String], { nullable: true })
  categories?: string[];
}
