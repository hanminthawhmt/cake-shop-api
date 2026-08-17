import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiPropertyOptional({
    example: 3,
    description: 'Updated quantity for the cart item.',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({
    example: 'Less sugar',
    description: 'Updated notes for the cart item.',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
