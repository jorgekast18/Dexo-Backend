import { Module, DynamicModule, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from '../infrastructure/schemas/log.schema';
import { LoggingService } from '../application/services/logger.service';
import { LoggingInterceptor } from '../interfaces/interceptors/logging.interceptor';

export interface LoggingModuleOptions {
  mongoUri: string;
  serviceName?: string;
}

@Global()
@Module({})
export class LoggingModule {
  static forRoot(options: LoggingModuleOptions): DynamicModule {
    return {
      module: LoggingModule,
      imports: [
        MongooseModule.forRoot(options.mongoUri, {
          connectionFactory: (connection) => {
            connection.on('connected', () =>
              console.log('✅ MongoDB connected for logging')
            );
            connection.on('error', (err) =>
              console.error('❌ MongoDB connection error:', err)
            );
            return connection;
          },
        }),
        MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
      ],
      providers: [
        LoggingService,
        LoggingInterceptor,
        {
          provide: 'SERVICE_NAME',
          useValue: options.serviceName || 'unknown-service',
        },
      ],
      exports: [
        LoggingService,
        LoggingInterceptor,
        'SERVICE_NAME'
      ],
    };
  }
}
