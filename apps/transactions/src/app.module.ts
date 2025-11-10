import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService, LoggingInterceptor, LogRecord } from '@dexo-app-monorepo/logging';
import { DatabaseModule } from './config/database.module';
import { TransactionController } from './interfaces/transaction.controller';
import { CreateTransactionUseCase } from './application/create-transaction.use-case';
import { TransactionDbRepository } from './infrastructure/repositories/transaction.db.repository';
import { TransactionTypeDbRepository } from './infrastructure/repositories/transaction-type.db.repository';
import { CategoryDbRepository } from './infrastructure/repositories/category.db.repository';
import { TransactionEntity } from './infrastructure/entities/transaction.entity';
import { TransactionTypeEntity } from './infrastructure/entities/transaction-type.entity';
import { CategoryEntity } from './infrastructure/entities/category.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      TransactionEntity,
      TransactionTypeEntity,
      CategoryEntity,
      LogRecord,
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    LoggerService,
    CreateTransactionUseCase,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionDbRepository,
    },
    {
      provide: 'ITransactionTypeRepository',
      useClass: TransactionTypeDbRepository,
    },
    {
      provide: 'ICategoryRepository',
      useClass: CategoryDbRepository,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
  ],
})
export class AppModule {}
