import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { CreateProductVariantInput } from './dto/create-product-variant.input';
import { CreateProductInput } from './dto/create-product.input';
import { DeleteProductVariantInput } from './dto/delete-product-variant.input';
import { DeleteProductInput } from './dto/delete-product.input';
import { UpdateProductVariantInput } from './dto/update-product-variant.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async findOneById(id: string) {
    const product = await this.productModel.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  async getProducts() {
    const products = await this.productModel.find({});

    return products;
  }

  async create(userInput: CreateProductInput) {
    const productCreated = await this.productModel.create(userInput);
    return productCreated;
  }

  async update(userInput: UpdateProductInput) {
    const { id, ...body } = userInput;
    const productUpdated = await this.productModel.findByIdAndUpdate(id, body);
    if (!productUpdated) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return productUpdated;
  }

  async delete(userInput: DeleteProductInput) {
    const productDeleted = await this.productModel.findByIdAndRemove(
      userInput.id,
    );
    if (!productDeleted) {
      throw new NotFoundException(`Product ${userInput.id} not found`);
    }
    return { _id: productDeleted._id };
  }

  async deleteProductVariant(userInput: DeleteProductVariantInput) {
    const { productId, variantId } = userInput;
    await this.productModel.findByIdAndUpdate(productId, {
      $pull: { variants: { _id: new Types.ObjectId(variantId) } },
    });
    return variantId;
  }

  async updateProductVariant(userInput: UpdateProductVariantInput) {
    const { productId, variantId, ...body } = userInput;
    await this.productModel.findByIdAndUpdate(
      productId,
      {
        $set: {
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

    return variantId;
  }

  async createProductVariant(userInput: CreateProductVariantInput) {
    const { productId, ...body } = userInput;
    const _id = new Types.ObjectId();
    await this.productModel.findByIdAndUpdate(productId, {
      $push: { variants: { ...body, _id } },
    });
    return _id;
  }
}
