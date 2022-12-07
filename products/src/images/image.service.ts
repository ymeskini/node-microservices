import { InjectQueue } from '@nestjs/bull';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { Model, ObjectId } from 'mongoose';

import { BulkUpdateImagesInput } from './dto/bulk-update-images.input';
import { CreateImageInput } from './dto/create-image.input';
import { UpdateImageInput } from './dto/update-image.input';
import { Image } from './image.schema';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<Image>,
    @InjectQueue('images') private readonly deleteImagesQueue: Queue,
  ) {}

  async create(userInput: CreateImageInput) {
    const image = await this.imageModel.create(userInput);

    return image;
  }

  async getImagesByProductId(id: ObjectId) {
    const images = await this.imageModel.find({ productId: id });

    return images;
  }

  async deleteImage(id: ObjectId) {
    const image = await this.imageModel.findByIdAndRemove(id);
    if (!image) {
      throw new NotFoundException(`Image with ${id} not found`);
    }

    return image._id;
  }

  async updateImage(userInput: UpdateImageInput) {
    const { imageId, ...body } = userInput;
    const image = await this.imageModel.findByIdAndUpdate(imageId, body);

    if (!image) {
      throw new NotFoundException(`Image with ${imageId} not found`);
    }

    return image;
  }

  async updateImages(userInput: BulkUpdateImagesInput) {
    const result = await this.imageModel.bulkWrite(
      userInput.images.map(({ id, ...body }) => ({
        updateOne: {
          filter: { _id: id },
          update: { body },
        },
      })),
    );

    return result.upsertedIds;
  }

  deleteImagesOfProduct(id: ObjectId) {
    return this.imageModel.deleteMany({ productId: id });
  }

  addDeleteImagesJob(id: ObjectId) {
    return this.deleteImagesQueue.add(
      'deleteImages',
      { productId: id },
      { removeOnComplete: true },
    );
  }
}
