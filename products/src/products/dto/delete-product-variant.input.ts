import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class DeleteProductVariantInput {
  @IsMongoId()
  @Field()
  productId: string;

  @IsMongoId()
  @Field()
  variantId: string;
}
