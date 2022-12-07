import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';

import { ImageResolver } from './image.resolver';
import { Image, ImageSchema } from './image.schema';
import { ImageService } from './image.service';
import { ImageProcessor } from './image.processor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    BullModule.registerQueue({
      name: 'images',
    }),
  ],
  providers: [ImageResolver, ImageService, ImageProcessor],
  exports: [ImageService],
})
export class ImageModule {}
