import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateImageInput } from './dto/create-image.input';

import { Image } from './image.schema';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<Image>,
  ) {}

  async create(userInput: CreateImageInput) {
    const image = await this.imageModel.create(userInput);

    return image;
  }

  async getImagesByProductId(id: ObjectId) {
    const images = await this.imageModel.find({ productId: id });

    return images;
  }
}
