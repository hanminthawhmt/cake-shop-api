import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CakeOptionsService } from './cake-options.service';
import { CreateCakeOptionDto } from './dtos/create-cake-option.dto';
import { Roles } from '../users/decorators/roles.decorator';
import { UpdateCakeOptionDto } from './dtos/update-cake-option.dto';
import { CreateCakeOptionValueDto } from './dtos/create-cake-option-value.dto';
import { UpdateCakeOptionValueDto } from './dtos/update-cake-option-value.dto';

@Controller('/:cakeId/options')
export class CakeOptionsController {
  constructor(private optionsService: CakeOptionsService) {}

  @Roles('owner')
  @Post()
  createOption(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Body() body: CreateCakeOptionDto,
  ) {
    return this.optionsService.createCakeOption(cakeId, body);
  }

  @Roles('owner')
  @Patch('/:optionId')
  updateOption(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() body: UpdateCakeOptionDto,
  ) {
    return this.optionsService.updateOption(cakeId, optionId, body);
  }

  @Roles('owner')
  @Delete('/:optionId')
  deleteOption(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
  ) {
    return this.optionsService.removeOption(cakeId, optionId);
  }

  @Roles('owner')
  @Post('/:optionId/values')
  createOptionValue(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
    @Body() body: CreateCakeOptionValueDto,
  ) {
    return this.optionsService.createOptionValue(cakeId, optionId, body);
  }

  @Roles('owner')
  @Patch('/:optionId/values/:valueId')
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
  deleteOptionValue(
    @Param('cakeId', ParseIntPipe) cakeId: number,
    @Param('valueId', ParseIntPipe) valueId: number,
    @Param('optionId', ParseIntPipe) optionId: number,
  ) {
    return this.optionsService.removeOptionValue(cakeId, optionId, valueId);
  }
}
