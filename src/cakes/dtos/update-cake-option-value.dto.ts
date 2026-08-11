import { CreateCakeOptionValueDto } from './create-cake-option-value.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCakeOptionValueDto extends PartialType(
  CreateCakeOptionValueDto,
) {}
