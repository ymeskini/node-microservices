import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ProductDocument } from '../products/product.schema';
import { AnalyticsService } from './analytics.service';

export const PRODUCT_CREATED_EVENT = 'product.created';
export const PRODUCT_UPDATED_EVENT = 'product.updated';
export const PRODUCT_DELETED_EVENT = 'product.deleted';
export const PRODUCT_VARIANT_CREATED_EVENT = 'product.variant.created';
export const PRODUCT_VARIANT_UPDATED_EVENT = 'product.variant.updated';
export const PRODUCT_VARIANT_DELETED_EVENT = 'product.variant.deleted';

@Injectable()
export class AnalyticsListener {
  constructor(private analyticsService: AnalyticsService) {}
  @OnEvent(PRODUCT_CREATED_EVENT, { async: true })
  handleProductCreatedEvent(product: ProductDocument) {
    return this.analyticsService.insertAnalyticsEvent(
      product,
      PRODUCT_CREATED_EVENT,
    );
  }

  @OnEvent(PRODUCT_UPDATED_EVENT, { async: true })
  handleProductUpdatedEvent(product: ProductDocument) {
    return this.analyticsService.insertAnalyticsEvent(
      product,
      PRODUCT_UPDATED_EVENT,
    );
  }

  @OnEvent(PRODUCT_DELETED_EVENT, { async: true })
  handleProductDeletedEvent(product: ProductDocument) {
    return this.analyticsService.insertAnalyticsEvent(
      product,
      PRODUCT_DELETED_EVENT,
    );
  }

  @OnEvent(PRODUCT_VARIANT_CREATED_EVENT, { async: true })
  handleProductVariantCreatedEvent(product: ProductDocument) {
    return this.analyticsService.insertAnalyticsEvent(
      product,
      PRODUCT_VARIANT_CREATED_EVENT,
    );
  }

  @OnEvent(PRODUCT_VARIANT_UPDATED_EVENT, { async: true })
  handleProductVariantUpdatedEvent(product: ProductDocument) {
    return this.analyticsService.insertAnalyticsEvent(
      product,
      PRODUCT_VARIANT_UPDATED_EVENT,
    );
  }

  @OnEvent(PRODUCT_VARIANT_DELETED_EVENT, { async: true })
  handleProductVariantDeletedEvent(product: ProductDocument) {
    return this.analyticsService.insertAnalyticsEvent(
      product,
      PRODUCT_VARIANT_DELETED_EVENT,
    );
  }
}
