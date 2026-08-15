import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CakeImage } from './entities/cake-image.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CakesService } from './cakes.service';
import { Express } from 'express';

@Injectable()
export class CakeImagesService {
  constructor(
    @InjectRepository(CakeImage) private cakeImage: Repository<CakeImage>,
    private cloudinaryService: CloudinaryService,
    private cakesService: CakesService,
  ) {}

  private async verifyImageBelongsToCake(cakeId: number, imageId: number) {
    const image = await this.cakeImage.findOne({
      where: { id: imageId, cakeId: cakeId },
    });
    if (!image) {
      throw new NotFoundException(
        `Image with ID ${imageId} not found for cake ${cakeId}.`,
      );
    }
    return image;
  }

  async uploadCakeImage(cakeId: number, file: Express.Multer.File) {
    await this.cakesService.findOne(cakeId);
    const { url, publicId } = await this.cloudinaryService.uploadImage(
      file,
      'cakes',
    );
    const image = this.cakeImage.create({ cakeId, url, publicId });
    return this.cakeImage.save(image);
  }

  async removeImage(cakeId: number, imageId: number) {
    const image = await this.verifyImageBelongsToCake(cakeId, imageId);
    await this.cloudinaryService.deleteImage(image.publicId);
    return this.cakeImage.remove(image);
  }
}
