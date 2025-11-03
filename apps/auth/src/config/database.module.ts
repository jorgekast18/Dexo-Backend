import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const POSTGRES_DATASOURCE = 'POSTGRES_DATASOURCE';

export const PostgresDatabaseProvider: Provider = {
  provide: POSTGRES_DATASOURCE,
  useFactory: async (configService: ConfigService) => {
    console.log('-->',configService.get<string>('database.host'));
    const dataSource = new DataSource({
      type: 'postgres',
      host: configService.get<string>('database.host', { infer: true }),
      port: configService.get<number>('database.port', { infer: true }),
      username: configService.get<string>('database.username', { infer: true }),
      password: configService.get<string>('database.password', { infer: true }),
      database: configService.get<string>('database.name', { infer: true }),
      entities: [],
      synchronize: configService.get<string>('environment') !== 'production',

    });
    return dataSource.initialize();
  },
  inject: [ConfigService],
};
