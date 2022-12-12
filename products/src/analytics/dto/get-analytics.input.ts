import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class GetAnalyticsInput {
  @IsMongoId()
  @Field(() => String)
  productId: string;
}
