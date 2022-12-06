import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CreateProductInput } from './dto/create-product.input';
import { Product } from './product.schema';
import { ProductService } from './product.service';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productsService: ProductService) {}

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions('create:products')
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return this.productsService.create(createProductInput);
  }

  @Query(() => Product)
  findOneProduct(@Args('id', { type: () => String }) id: string) {
    return this.productsService.findOneById(id);
  }

  @Query(() => [Product])
  getProducts() {
    return this.productsService.getProducts();
  }
}
