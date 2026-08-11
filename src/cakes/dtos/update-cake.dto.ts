import { PartialType } from '@nestjs/mapped-types';
import { CreateCakeDto } from './create-cake.dto';

export class UpdateCakeDto extends PartialType(CreateCakeDto) {}
// taking all the fields from CreateCakeDto and making them optional
