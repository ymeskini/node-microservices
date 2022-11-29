import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { Product } from './product.model';
import { ProductService } from './product.service';

@Resolver((of) => Product)
export class ProductResolver {
  constructor(private productsService: ProductService) {}

  @Query((returns) => Product)
  async author(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.findOneById(id);
  }
}
