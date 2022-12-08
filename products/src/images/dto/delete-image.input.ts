import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class DeleteImageInput {
  @IsMongoId()
  @Field(() => String)
  imageId: Types.ObjectId;
}
