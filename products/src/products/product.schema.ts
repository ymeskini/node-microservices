import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

import { Image, ImageDocument } from '../images/image.schema';

export type ProductDocument = HydratedDocument<Product>;

@ObjectType()
export class ProductVariant {
  @Prop({ type: Types.ObjectId })
  @Field(() => String)
  _id: ObjectId;

  @Prop()
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => Int)
  sku: number;
}

@ObjectType()
@Schema()
export class Product {
  @Prop()
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => Date)
  createdAt: Date;

  @Prop()
  @Field(() => Date)
  modifiedAt: Date;

  @Prop()
  @Field(() => [String])
  categories: string[];

  @Prop()
  @Field(() => String)
  userId: string;

  @Prop({ ref: Image.name, type: Types.ObjectId })
  @Field(() => [Image])
  images: ImageDocument[];

  @Prop()
  @Field(() => [ProductVariant])
  variants: ProductVariant[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ name: 'text' });
