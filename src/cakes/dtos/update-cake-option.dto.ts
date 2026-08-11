import { PartialType } from '@nestjs/mapped-types';
import { CreateCakeOptionDto } from './create-cake-option.dto';

export class UpdateCakeOptionDto extends PartialType(CreateCakeOptionDto) {}
