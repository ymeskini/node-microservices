import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { ImageService } from '../images/image.service';
import { GqlAuthGuard } from '../auth/auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CreateProductInput } from './dto/create-product.input';
import { DeleteProductInput } from './dto/delete-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product, ProductDocument } from './product.schema';
import { ProductService } from './product.service';
import { Image } from '../images/image.schema';
import { CreateProductVariantInput } from './dto/create-product-variant.input';
import { DeleteProductVariantInput } from './dto/delete-product-variant.input';
import { UpdateProductVariantInput } from './dto/update-product-variant.input';
import { GetProductsInput } from './dto/get-products.input';
import { GetUser, User } from '../auth/user.decorator';

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private productsService: ProductService,
    private imageService: ImageService,
  ) {}

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions('create:products')
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @GetUser() user: User,
  ) {
    return this.productsService.create(createProductInput, user.sub);
  }

  @Mutation(() => Product)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions('update:products')
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.update(updateProductInput);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions('delete:products')
  async deleteProduct(
    @Args('deleteProductInput') deleteProductInput: DeleteProductInput,
  ) {
    const { _id } = await this.productsService.delete(deleteProductInput);
    await this.imageService.addDeleteImagesJob(_id);
    return _id;
  }

  @Query(() => Product)
  getProduct(@Args('id', { type: () => String }) id: string) {
    return this.productsService.findOneById(id);
  }

  @Query(() => [Product], { nullable: true })
  getProducts(
    @Args('getProductsInput', { nullable: true })
    getProductsInput?: GetProductsInput,
  ) {
    return this.productsService.getProducts(getProductsInput);
  }

  @ResolveField('images', () => [Image])
  async getProductImages(@Parent() product: ProductDocument) {
    const { _id } = product;
    return this.imageService.getImagesByProductId(_id);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions('create:products')
  createProductVariant(
    @Args('createProductVariant')
    createProductVariant: CreateProductVariantInput,
  ) {
    return this.productsService.createProductVariant(createProductVariant);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions('delete:products')
  deleteProductVariant(
    @Args('deleteProductVariant')
    deleteProductVariant: DeleteProductVariantInput,
  ) {
    return this.productsService.deleteProductVariant(deleteProductVariant);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard, PermissionsGuard)
  @Permissions('update:products')
  updateProductVariant(
    @Args('updateProductVariant')
    updateProductVariant: UpdateProductVariantInput,
  ) {
    return this.productsService.updateProductVariant(updateProductVariant);
  }
}
