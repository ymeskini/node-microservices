import { Field, InputType } from '@nestjs/graphql';
import { IsUrl, IsMongoId } from 'class-validator';

@InputType()
export class CreateImageInput {
  @IsUrl()
  @Field(() => String)
  url: string;

  @IsMongoId()
  @Field(() => String)
  productId: string;
}
