import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryInterface } from '../domain/ports/user.repository.interface';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from '../interfaces/dto/login.dto';
import { User } from '../domain/models/user.model';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async execute(loginDto: LoginRequestDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    const user: User = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    // *Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const token: string = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
