import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { BulkUpdateImagesInput } from './dto/bulk-update-images.input';
import { CreateImageInput } from './dto/create-image.input';
import { DeleteImageInput } from './dto/delete-image.input';
import { UpdateImageInput } from './dto/update-image.input';
import { Image } from './image.schema';
import { ImageService } from './image.service';

@Resolver(() => Image)
export class ImageResolver {
  constructor(private imageService: ImageService) {}

  @Mutation(() => Image)
  async createImage(
    @Args('createImageInput') createImageInput: CreateImageInput,
  ) {
    return this.imageService.create(createImageInput);
  }

  @Mutation(() => String)
  deleteImage(@Args('deleteImageInput') deleteImageInput: DeleteImageInput) {
    return this.imageService.deleteImage(deleteImageInput.imageId);
  }

  @Mutation(() => Image)
  updateImage(@Args('updateImageInput') updateImageInput: UpdateImageInput) {
    return this.imageService.updateImage(updateImageInput);
  }

  @Mutation(() => [String])
  bulkUpdateImages(
    @Args('bulkUpdateImagesInput') bulkUpdateImagesInput: BulkUpdateImagesInput,
  ) {
    return this.imageService.updateImages(bulkUpdateImagesInput);
  }
}
