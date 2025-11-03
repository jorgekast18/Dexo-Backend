import { IsEmail, IsString, IsInt, Min, Max, IsIn } from 'class-validator';

export class SignupDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsInt() @Min(0) @Max(120) age: number;
  @IsIn(['male', 'female', 'other']) gender: string;
  @IsString() password: string;
}
