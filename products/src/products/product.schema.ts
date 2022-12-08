import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Image, ImageDocument } from 'src/images/image.schema';

export type ProductDocument = HydratedDocument<Product>;

@ObjectType()
@Schema()
export class Product {
  @Prop()
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => [Image])
  images: ImageDocument[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
