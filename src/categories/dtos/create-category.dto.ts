import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Birthday Cakes',
    description: 'Name of the cake category.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
