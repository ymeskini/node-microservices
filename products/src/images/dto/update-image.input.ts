import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsUrl } from 'class-validator';
import { ObjectId } from 'mongoose';

@InputType()
export class UpdateImageInput {
  @IsMongoId()
  @Field(() => String)
  imageId: ObjectId;

  @IsUrl()
  @Field(() => String)
  url: string;
}
