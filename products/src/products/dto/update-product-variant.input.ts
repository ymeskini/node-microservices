import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, Min, MinLength } from 'class-validator';

@InputType()
export class UpdateProductVariantInput {
  @Field()
  @MinLength(3)
  name: string;

  @Field()
  @Min(0)
  sku: number;

  @IsMongoId()
  @Field()
  productId: string;

  @IsMongoId()
  @Field()
  variantId: string;
}
