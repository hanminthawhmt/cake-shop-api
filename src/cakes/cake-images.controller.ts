import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../users/decorators/roles.decorator';
import { UseInterceptors } from '@nestjs/common';
import { CakeImagesService } from './cake-images.service';

@Controller('/cakes/:cakeId/images')
export class CakeImagesController {
  constructor(private cakeImagesService: CakeImagesService) {}

  @Roles('owner')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  uploadCakeImage(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cakeImagesService.uploadCakeImage(cakeId, file);
  }

  @Roles('owner')
  @Delete('/:imageId')
  deleteCakeImage(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.cakeImagesService.removeImage(cakeId, imageId);
  }
}
