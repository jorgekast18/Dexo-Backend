import { Controller, Post, Body } from '@nestjs/common';
import { SignupUseCase } from '../application/signup.use-case';
import { SignupDto } from './signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly signupUseCase: SignupUseCase) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.signupUseCase.execute(signupDto);
    return { id: user.id, name: user.name, email: user.email };
  }
}
