import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './environment';
import { TransactionEntity } from '../infrastructure/entities/transaction.entity';
import { TransactionTypeEntity } from '../infrastructure/entities/transaction-type.entity';
import { CategoryEntity } from '../infrastructure/entities/category.entity';
import { LogRecord } from '@dexo-app-monorepo/logging';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...getDatabaseConfig(),
      entities: [
        TransactionEntity,
        TransactionTypeEntity,
        CategoryEntity,
        LogRecord],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
  ],
})
export class DatabaseModule {}
