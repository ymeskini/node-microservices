import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsMongoId, IsUrl } from 'class-validator';
import { ObjectId } from 'mongoose';

@ObjectType()
@InputType()
class UpdateImageBody {
  @IsMongoId()
  @Field(() => String)
  id: ObjectId;

  @IsUrl()
  @Field(() => String)
  url: string;
}

@InputType()
export class BulkUpdateImagesInput {
  @Field(() => [UpdateImageBody])
  images: UpdateImageBody[];
}
