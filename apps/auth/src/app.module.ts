import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerService, LoggingInterceptor, LogRecord } from '@dexo-app-monorepo/logging';

import environmentVars, { getJwtSecret } from './config/environment';
import { SignupUseCase } from './application/signup.use-case';
import { UserRepository } from './infrastructure/repositories/user.db.repository';
import { AuthController } from './interfaces/auth.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/entities/user.entity';
import { LoginUseCase } from './application/login.use-case';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [LogRecord, UserEntity],
        synchronize: configService.get('environment') !== 'production',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([LogRecord, UserEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environmentVars],
      envFilePath: [__dirname + '/../.env'],
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    AppService,
    SignupUseCase,
    LoginUseCase,
    { provide: 'IUserRepository', useClass: UserRepository }
  ],
  exports: ['IUserRepository']
})
export class AppModule {}
