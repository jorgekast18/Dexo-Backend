import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresDatabaseProvider } from './config/database.module';
import { ConfigModule } from '@nestjs/config';

import environmentVars from './config/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environmentVars],
      envFilePath: [__dirname + '/../.env'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PostgresDatabaseProvider],
  exports: [PostgresDatabaseProvider]
})
export class AppModule {}
