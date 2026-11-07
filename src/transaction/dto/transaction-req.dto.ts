import { IsDateString, IsInt, IsNumberString, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionRequestDto {
  @Type(() => Number)
  @IsInt()
  categoryId: number;

  @IsNumberString()
  amount: string;

  @IsString()
  description: string;

  @IsDateString()
  transactionDate: string;
}
