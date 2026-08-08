import { IsString, IsEmail } from 'class-validator';

export class LogInUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
