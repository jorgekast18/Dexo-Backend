import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresDatabaseProvider } from './config/database.module';
import { ConfigModule } from '@nestjs/config';

import environmentVars from './config/environment';
import { SignupUseCase } from './application/signup.use-case';
import { UserRepository } from './infrastructure/user.memory.repository';
import { AuthController } from './interfaces/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environmentVars],
      envFilePath: [__dirname + '/../.env'],
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    PostgresDatabaseProvider,
    SignupUseCase,
    { provide: 'IUserRepository', useClass: UserRepository }
  ],
  exports: [PostgresDatabaseProvider]
})
export class AppModule {}
