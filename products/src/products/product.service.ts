import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  PRODUCT_CREATED_EVENT,
  PRODUCT_DELETED_EVENT,
  PRODUCT_UPDATED_EVENT,
  PRODUCT_VARIANT_DELETED_EVENT,
} from '../analytics/analytics.listener';
import { CreateProductVariantInput } from './dto/create-product-variant.input';
import { CreateProductInput } from './dto/create-product.input';
import { DeleteProductVariantInput } from './dto/delete-product-variant.input';
import { DeleteProductInput } from './dto/delete-product.input';
import { GetProductsInput } from './dto/get-products.input';
import { UpdateProductVariantInput } from './dto/update-product-variant.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findOneById(id: string) {
    const product = await this.productModel.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  async getProducts(userInput?: GetProductsInput) {
    let query = this.productModel.find({});

    if (userInput?.name) {
      query = query.find({ $text: { $search: userInput.name } });
    }

    if (userInput?.categories) {
      query = query.find({ categories: { $all: userInput.categories } });
    }

    if (userInput?.createdAt) {
      query = query.find({ createdAt: userInput.createdAt });
    }

    const products = await query.exec();

    return products;
  }

  async create(userInput: CreateProductInput, userId: string) {
    const productCreated = await this.productModel.create({
      ...userInput,
      userId,
      createdAt: new Date(),
      modifiedAt: new Date(),
    });
    this.eventEmitter.emit(PRODUCT_CREATED_EVENT, productCreated);
    return productCreated;
  }

  async update(userInput: UpdateProductInput) {
    const { id, ...body } = userInput;
    const productUpdated = await this.productModel.findByIdAndUpdate(
      id,
      {
        ...body,
        modifiedAt: new Date(),
      },
      { returnDocument: 'after' },
    );
    if (!productUpdated) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    this.eventEmitter.emit(PRODUCT_UPDATED_EVENT, productUpdated);
    return productUpdated;
  }

  async delete(userInput: DeleteProductInput) {
    const productDeleted = await this.productModel.findByIdAndRemove(
      userInput.id,
    );
    if (!productDeleted) {
      throw new NotFoundException(`Product ${userInput.id} not found`);
    }
    this.eventEmitter.emit(PRODUCT_DELETED_EVENT, productDeleted);

    return { _id: productDeleted._id };
  }

  async deleteProductVariant(userInput: DeleteProductVariantInput) {
    const { productId, variantId } = userInput;
    const product = await this.productModel.findByIdAndUpdate(productId, {
      modifiedAt: new Date(),
      $pull: { variants: { _id: new Types.ObjectId(variantId) } },
    });
    this.eventEmitter.emit(PRODUCT_VARIANT_DELETED_EVENT, product);

    return variantId;
  }

  async updateProductVariant(userInput: UpdateProductVariantInput) {
    const { productId, variantId, ...body } = userInput;
    const product = await this.productModel.findByIdAndUpdate(
      productId,
      {
        $set: {
          modifiedAt: new Date(),
          'variants.$[variant]': {
            ...body,
            _id: new Types.ObjectId(variantId),
          },
        },
      },
      {
        arrayFilters: [
          {
            'variant._id': new Types.ObjectId(variantId),
          },
        ],
      },
    );

    this.eventEmitter.emit(PRODUCT_UPDATED_EVENT, product);

    return variantId;
  }

  async createProductVariant(userInput: CreateProductVariantInput) {
    const { productId, ...body } = userInput;
    const _id = new Types.ObjectId();
    const product = await this.productModel.findByIdAndUpdate(productId, {
      modifiedAt: new Date(),
      $push: { variants: { ...body, _id } },
    });

    this.eventEmitter.emit(PRODUCT_CREATED_EVENT, product);
    return _id;
  }
}
