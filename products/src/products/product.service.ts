import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  findOneById(id: number): { id: number } {
    return { id };
  }
}
