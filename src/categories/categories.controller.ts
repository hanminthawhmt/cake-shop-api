import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Roles } from '../users/decorators/roles.decorator';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Public } from '../users/decorators/public.decorators';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  listCategory() {
    return this.categoriesService.findAll();
  }

  @Roles('owner')
  @Post()
  createCategory(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body.name);
  }

  @Public()
  @Get('/:id')
  getCategoryById(@Param('id') id: string) {
    return this.categoriesService.findOne(parseInt(id));
  }

  @Roles('owner')
  @Patch('/:id')
  updateCategory(@Param('id') id: string, @Body() body: CreateCategoryDto) {
    return this.categoriesService.update(parseInt(id), body);
  }

  @Roles('owner')
  @Delete('/:id')
  removeCategory(@Param('id') id: string) {
    return this.categoriesService.remove(parseInt(id));
  }
}
