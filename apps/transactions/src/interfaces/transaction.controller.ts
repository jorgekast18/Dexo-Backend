import {
  Controller,
  Post,
  Body,
  Param,
  Query,
  Get,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateTransactionUseCase } from '../application/create-transaction.use-case';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionByIdUseCase } from '../application/get-transaction-by-id.use-case';
import { GetAllTransactionsUseCase } from '../application/get-all-transactions.use-case';
import { UpdateTransactionUseCase } from '../application/update-transaction.use-case';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DeleteTransactionUseCase } from '../application/delete-transaction.use-case';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionByIdUseCase: GetTransactionByIdUseCase,
    private readonly getAllTransactionsUseCase: GetAllTransactionsUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.createTransactionUseCase.execute(createTransactionDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.getTransactionByIdUseCase.execute(id);
  }

  @Get()
  async findAll(@Query('userId') userId: string) {
    return this.getAllTransactionsUseCase.execute(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.updateTransactionUseCase.execute(id, updateTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteTransactionUseCase.execute(id);
  }
}
