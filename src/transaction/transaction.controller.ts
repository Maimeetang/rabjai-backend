import type { AuthenticatedRequest } from '@/auth/interface/request.interface.js';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionRequestDto } from './dto/transaction-req.dto.js';
import { TransactionService } from './transaction.service.js';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: TransactionRequestDto) {
    return this.transactionService.create(
      req.user.sub,
      dto.categoryId,
      dto.amount,
      dto.description,
      new Date(dto.transactionDate),
    );
  }
}
