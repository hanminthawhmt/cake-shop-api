import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Roles } from '../users/decorators/roles.decorator';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Public } from '../users/decorators/public.decorators';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'List categories',
    description: 'Returns all cake categories available in the catalog.',
  })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully.' })
  listCategory() {
    return this.categoriesService.findAll();
  }

  @Roles('owner')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a category',
    description: 'Creates a new category for organizing cakes.',
  })
  @ApiBody({ type: CreateCategoryDto, description: 'Category details.' })
  @ApiResponse({ status: 201, description: 'Category created successfully.' })
  createCategory(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body.name);
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Get category by ID', description: 'Gets a single category.' })
  @ApiParam({ name: 'id', type: Number, description: 'Category identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Category found successfully.' })
  getCategoryById(@Param('id') id: string) {
    return this.categoriesService.findOne(parseInt(id));
  }

  @Roles('owner')
  @Patch('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a category',
    description: 'Updates an existing category. Restricted to owners.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Category identifier', example: 1 })
  @ApiBody({ type: CreateCategoryDto, description: 'Updated category name.' })
  @ApiResponse({ status: 200, description: 'Category updated successfully.' })
  updateCategory(@Param('id') id: string, @Body() body: CreateCategoryDto) {
    return this.categoriesService.update(parseInt(id), body);
  }

  @Roles('owner')
  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Deletes a category. Restricted to owners.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Category identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Category removed successfully.' })
  removeCategory(@Param('id') id: string) {
    return this.categoriesService.remove(parseInt(id));
  }
}
