import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCakeOptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
