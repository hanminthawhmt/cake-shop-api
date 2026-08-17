import {
  Controller,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../users/decorators/roles.decorator';
import { CakeImagesService } from './cake-images.service';

@ApiTags('Cake Images')
@Controller('/cakes/:cakeId/images')
export class CakeImagesController {
  constructor(private cakeImagesService: CakeImagesService) {}

  @Roles('owner')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload cake image',
    description: 'Uploads a product image for a cake. Restricted to owners.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiParam({ name: 'cakeId', type: Number, description: 'Cake identifier', example: 1 })
  @ApiResponse({ status: 201, description: 'Cake image uploaded successfully.' })
  uploadCakeImage(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cakeImagesService.uploadCakeImage(cakeId, file);
  }

  @Roles('owner')
  @Delete('/:imageId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete cake image',
    description: 'Deletes a cake image by identifier.',
  })
  @ApiParam({ name: 'cakeId', type: Number, description: 'Cake identifier', example: 1 })
  @ApiParam({ name: 'imageId', type: Number, description: 'Image identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Cake image deleted successfully.' })
  deleteCakeImage(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.cakeImagesService.removeImage(cakeId, imageId);
  }
}
