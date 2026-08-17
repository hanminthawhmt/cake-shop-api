import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CakeOptionsService } from './cake-options.service';
import { CreateCakeOptionDto } from './dtos/create-cake-option.dto';
import { Roles } from '../users/decorators/roles.decorator';
import { UpdateCakeOptionDto } from './dtos/update-cake-option.dto';
import { CreateCakeOptionValueDto } from './dtos/create-cake-option-value.dto';
import { UpdateCakeOptionValueDto } from './dtos/update-cake-option-value.dto';

@ApiTags('Cake Options')
@Controller('/cakes/:cakeId/options')
export class CakeOptionsController {
  constructor(private optionsService: CakeOptionsService) {}

  @Roles('owner')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create cake option',
    description: 'Creates a new option group for a cake, like size or flavor.',
  })
  @ApiParam({ name: 'cakeId', type: Number, description: 'Cake identifier', example: 1 })
  @ApiBody({ type: CreateCakeOptionDto, description: 'Cake option payload.' })
  @ApiResponse({ status: 201, description: 'Cake option created successfully.' })
  createOption(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Body() body: CreateCakeOptionDto,
  ) {
    return this.optionsService.createCakeOption(cakeId, body);
  }

  @Roles('owner')
  @Patch('/:optionId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update cake option',
    description: 'Updates a cake option group for a given cake.',
  })
  @ApiParam({ name: 'cakeId', type: Number, description: 'Cake identifier', example: 1 })
  @ApiParam({ name: 'optionId', type: Number, description: 'Option identifier', example: 1 })
  @ApiBody({ type: UpdateCakeOptionDto, description: 'Fields to update.' })
  @ApiResponse({ status: 200, description: 'Cake option updated successfully.' })
  updateOption(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() body: UpdateCakeOptionDto,
  ) {
    return this.optionsService.updateOption(cakeId, optionId, body);
  }

  @Roles('owner')
  @Delete('/:optionId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete cake option',
    description: 'Deletes a cake option group and its associated values.',
  })
  @ApiParam({ name: 'cakeId', type: Number, description: 'Cake identifier', example: 1 })
  @ApiParam({ name: 'optionId', type: Number, description: 'Option identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Cake option deleted successfully.' })
  deleteOption(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
  ) {
    return this.optionsService.removeOption(cakeId, optionId);
  }

  @Roles('owner')
  @Post('/:optionId/values')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create option value',
    description: 'Adds a choice value to a cake option, like small/medium/large.',
  })
  @ApiParam({ name: 'cakeId', type: Number, description: 'Cake identifier', example: 1 })
  @ApiParam({ name: 'optionId', type: Number, description: 'Option identifier', example: 1 })
  @ApiBody({ type: CreateCakeOptionValueDto, description: 'Option value payload.' })
  @ApiResponse({ status: 201, description: 'Option value created successfully.' })
  createOptionValue(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() body: CreateCakeOptionValueDto,
  ) {
    return this.optionsService.createOptionValue(cakeId, optionId, body);
  }

  @Roles('owner')
  @Patch('/:optionId/values/:valueId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update option value',
    description: 'Updates an option value for a cake option.',
  })
  @ApiParam({ name: 'cakeId', type: Number, description: 'Cake identifier', example: 1 })
  @ApiParam({ name: 'optionId', type: Number, description: 'Option identifier', example: 1 })
  @ApiParam({ name: 'valueId', type: Number, description: 'Option value identifier', example: 1 })
  @ApiBody({ type: UpdateCakeOptionValueDto, description: 'Updated option value fields.' })
  @ApiResponse({ status: 200, description: 'Option value updated successfully.' })
  updateOptionValue(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Param('valueId', ParseIntPipe) valueId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() body: UpdateCakeOptionValueDto,
  ) {
    return this.optionsService.updateOptionValue(
      cakeId,
      optionId,
      valueId,
      body,
    );
  }

  @Roles('owner')
  @Delete('/:optionId/values/:valueId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete option value',
    description: 'Removes a specific option value from an option group.',
  })
  @ApiParam({ name: 'cakeId', type: Number, description: 'Cake identifier', example: 1 })
  @ApiParam({ name: 'optionId', type: Number, description: 'Option identifier', example: 1 })
  @ApiParam({ name: 'valueId', type: Number, description: 'Option value identifier', example: 1 })
  @ApiResponse({ status: 200, description: 'Option value deleted successfully.' })
  deleteOptionValue(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Param('valueId', ParseIntPipe) valueId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
  ) {
    return this.optionsService.removeOptionValue(cakeId, optionId, valueId);
  }
}
