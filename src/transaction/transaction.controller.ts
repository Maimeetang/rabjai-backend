import type { AuthenticatedRequest } from '@/auth/interface/request.interface.js';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionService } from './transaction.service.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/category/:categoryId')
  create(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionService.create(categoryId, req.user.sub, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.transactionService.update(req.user.sub, id, dto);
  }

  @Get('/account/:accountId')
  findByAccount(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.transactionService.findBelongToAccount(
      accountId,
      req.user.sub,
      startDate,
      endDate,
    );
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.transactionService.delete(id, req.user.sub);
  }
}
