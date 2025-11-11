import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponseDto {
  access_token: string;
}
