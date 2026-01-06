import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getPort } from './config/environment';

//import { SentryExceptionFilter, initializeSentry } from '@dexo-app-monorepo/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  //app.useGlobalFilters(new SentryExceptionFilter('transactions-service'));

  // initializeSentry({
  //   serviceName: 'transactions-service',
  // });

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = getPort();
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🚀 Application is running on: ${await app.getUrl()}/${globalPrefix}`
  );
}

bootstrap();
