import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
//import { SentryExceptionFilter, initializeSentry } from '@dexo-app-monorepo/shared';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app: INestApplication = await NestFactory.create(AppModule);
  //app.useGlobalFilters(new SentryExceptionFilter('auth-service'));

  // initializeSentry({
  //   serviceName: 'auth-service',
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 App running on ${await app.getUrl()}/`, 'Bootstrap')
}
bootstrap();
