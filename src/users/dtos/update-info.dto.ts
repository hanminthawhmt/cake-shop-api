import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInfoDto {
  @ApiPropertyOptional({
    example: '123 Main Street, Yangon',
    description: 'Updated home or delivery address.',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: '+95912345678',
    description: 'Updated phone number.',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
