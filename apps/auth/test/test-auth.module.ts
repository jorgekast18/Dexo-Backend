import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Importa las entidades
import { UserEntity } from '../src/infrastructure/entities/user.entity';

// Importa los módulos específicos (NO el AppModule completo)
import { AuthController } from '../src/interfaces/auth.controller';
import { SignupUseCase } from '../src/application/signup.use-case';
import { LoginUseCase } from '../src/application/login.use-case';
import { UserRepository } from '../src/infrastructure/repositories/user.db.repository';

// Importa el módulo de logging si es necesario
import { LoggingModule } from '@dexo-app-monorepo/logging';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test_user',
      password: 'test_password',
      database: 'test_db',
      entities: [UserEntity],
      synchronize: true,
      dropSchema: true,
      logging: false,
    }),
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register({
      secret: 'test-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    LoggingModule.forRoot({
      mongoUri: 'mongodb://admin:admin123@localhost:27017/logging_test?authSource=admin',
    }),
  ],
  controllers: [AuthController],
  providers: [
    SignupUseCase,
    LoginUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class TestAuthModule {}
