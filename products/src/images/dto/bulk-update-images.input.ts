import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsMongoId, IsUrl } from 'class-validator';

@ObjectType()
@InputType()
class UpdateImageBody {
  @IsMongoId()
  @Field(() => String)
  id: string;

  @IsUrl()
  @Field(() => String)
  url: string;
}

@InputType()
export class BulkUpdateImagesInput {
  @Field(() => [UpdateImageBody])
  images: UpdateImageBody[];
}
