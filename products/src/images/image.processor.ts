import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ImageService } from './image.service';

@Processor('images')
export class ImageProcessor {
  private readonly logger = new Logger(ImageProcessor.name);

  constructor(private imageService: ImageService) {}

  @Process('deleteImages')
  async handleDeleteImages(job: Job) {
    this.logger.debug(
      `Deleting images for productId: ${job.data.productId}...`,
    );
    await this.imageService.deleteImagesOfProduct(job.data.productId);
  }
}
