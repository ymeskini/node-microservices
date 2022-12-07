import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { CreateImageInput } from './dto/create-image.input';
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
}
