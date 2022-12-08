import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductInput } from './dto/create-product.input';
import { DeleteProductInput } from './dto/delete-product.input';
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
}
