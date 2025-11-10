import { Body, Controller, Post } from '@nestjs/common';
import { SignupUseCase } from '../application/signup.use-case';
import { SignupDto } from './signup.dto';
import { User } from '../domain/models/user.model';
import { LoginUseCase } from '../application/login.use-case';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUserCase: LoginUseCase
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<User> {
    return await this.signupUseCase.execute(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return await this.loginUserCase.execute(loginDto);
  }
}
