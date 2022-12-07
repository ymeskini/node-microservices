import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageResolver } from './image.resolver';
import { Image, ImageSchema } from './image.schema';
import { ImageService } from './image.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  providers: [ImageResolver, ImageService],
  exports: [ImageService],
})
export class ImageModule {}
