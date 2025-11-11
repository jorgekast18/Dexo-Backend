import { IsUUID, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  transactionTypeId: string;

  @IsUUID()
  categoryId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}
