import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';

import { Product } from '../products/product.schema';

export type AnalyticsDocument = HydratedDocument<Analytics>;

@ObjectType()
@Schema()
export class Analytics {
  @Prop()
  @Field(() => String)
  event: string;

  @Prop()
  @Field(() => String)
  userId: string;

  @Prop()
  @Field(() => Date)
  date: Date;

  @Prop({ type: Types.ObjectId, ref: Product.name })
  @Field(() => String)
  productId: ObjectId;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
