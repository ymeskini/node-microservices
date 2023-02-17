import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { Model, Types } from 'mongoose';

import { BulkUpdateImagesInput } from './dto/bulk-update-images.input';
import { CreateImageInput } from './dto/create-image.input';
import { UpdateImageInput } from './dto/update-image.input';
import { Image, ImageDocument } from './image.schema';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<ImageDocument>,
    @InjectQueue('images') private readonly deleteImagesQueue: Queue,
  ) {}

  async create(userInput: CreateImageInput) {
    const image = await this.imageModel.create({
      ...userInput,
      productId: new Types.ObjectId(userInput.productId),
    });

    return image;
  }

  async getImagesByProductId(id: Types.ObjectId) {
    const images = await this.imageModel.find({ productId: id });

    return images;
  }

  async deleteImage(id: Types.ObjectId) {
    const image = await this.imageModel.findByIdAndRemove(id);
    if (!image) {
      throw new NotFoundException(`Image with ${id} not found`);
    }

    return image._id;
  }

  async updateImage(userInput: UpdateImageInput) {
    const { imageId, ...body } = userInput;
    const image = await this.imageModel.findByIdAndUpdate(imageId, body, {
      returnDocument: 'after',
    });

    if (!image) {
      throw new NotFoundException(`Image with ${imageId} not found`);
    }

    return image;
  }

  async updateImages(userInput: BulkUpdateImagesInput) {
    await this.imageModel.bulkWrite(
      userInput.images.map((image) => {
        return {
          updateOne: {
            filter: { _id: new Types.ObjectId(image.id) },
            update: { $set: { url: image.url } },
          },
        };
      }),
    );

    return userInput.images.map(({ id }) => id);
  }

  deleteImagesOfProduct(id: Types.ObjectId) {
    return this.imageModel.deleteMany({ productId: id });
  }

  addDeleteImagesJob(id: Types.ObjectId) {
    return this.deleteImagesQueue.add(
      'deleteImages',
      { productId: id },
      { removeOnComplete: true },
    );
  }
}
