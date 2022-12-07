import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@ObjectType()
@Schema()
export class Image {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field(() => String)
  url: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  @Field(() => String)
  productId: MongooseSchema.Types.ObjectId;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
