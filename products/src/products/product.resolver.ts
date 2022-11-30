import { Args, Query, Resolver } from '@nestjs/graphql';

import { Product } from './product.schema';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productsService: ProductService) {}

  @Query(() => Product)
  findOneProduct(@Args('id', { type: () => String }) id: string) {
    return this.productsService.findOneById(id);
  }
}
