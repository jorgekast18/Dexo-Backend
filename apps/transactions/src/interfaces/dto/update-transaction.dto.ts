import { IsUUID, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTransactionDto {
  @IsUUID()
  @IsOptional()
  transactionTypeId?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  description?: string;
}
