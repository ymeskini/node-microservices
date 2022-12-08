import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@ObjectType()
@Schema()
export class Image {
  @Prop()
  @Field(() => String)
  url: string;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  @Field(() => String)
  productId: ObjectId;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
