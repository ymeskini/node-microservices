import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Image, ImageDocument } from 'src/images/image.schema';

export type ProductDocument = HydratedDocument<Product>;

@ObjectType()
@Schema()
export class Product {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => [Image])
  images: ImageDocument[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
