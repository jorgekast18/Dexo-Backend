import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggingInterceptor, LoggingModule } from '@dexo-app-monorepo/logging';
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
import { GetAllTransactionsUseCase } from './application/get-all-transactions.use-case';
import { GetTransactionByIdUseCase } from './application/get-transaction-by-id.use-case';
import { UpdateTransactionUseCase } from './application/update-transaction.use-case';
import { DeleteTransactionUseCase } from './application/delete-transaction.use-case';
import { ConfigModule } from '@nestjs/config';

console.log('process.env.MONGO_URI -->', process.env.MONGO_URI);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      TransactionEntity,
      TransactionTypeEntity,
      CategoryEntity,
    ]),
    LoggingModule.forRoot({
      mongoUri: process.env.MONGO_URI,
      serviceName: 'transactions-service',
    }),
  ],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    GetAllTransactionsUseCase,
    GetTransactionByIdUseCase,
    UpdateTransactionUseCase,
    DeleteTransactionUseCase,
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
