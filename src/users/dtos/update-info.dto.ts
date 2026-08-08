import { IsOptional, IsString } from 'class-validator';

export class UpdateInfoDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
