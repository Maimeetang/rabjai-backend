import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumberString()
  amount: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  transactionDate: string;
}
