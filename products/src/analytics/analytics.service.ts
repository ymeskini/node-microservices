import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ProductDocument } from '../products/product.schema';

import { Analytics, AnalyticsDocument } from './analytics.schema';
import { GetAnalyticsInput } from './dto/get-analytics.input';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name)
    private readonly analyticsModel: Model<AnalyticsDocument>,
  ) {}

  async insertAnalyticsEvent(product: ProductDocument, event: string) {
    const analyticsEvent = await this.analyticsModel.create({
      event,
      userId: product.userId,
      productId: product._id,
      date: new Date(),
    });
    return analyticsEvent;
  }

  async getProductAnalytics(userInput: GetAnalyticsInput) {
    const analytics = await this.analyticsModel.find({
      productId: new Types.ObjectId(userInput.productId),
    });
    return analytics;
  }
}
