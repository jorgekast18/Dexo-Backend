import { Controller, Post, Body } from '@nestjs/common';
import { CreateTransactionUseCase } from '../application/create-transaction.use-case';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.createTransactionUseCase.execute(createTransactionDto);
  }
}
