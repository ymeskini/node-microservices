import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@ObjectType()
@Schema()
export class Product {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId | string;

  @Prop()
  @Field(() => String)
  name: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
