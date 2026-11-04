import {
  Controller,
  Get,
  Param,
  Request,
  ParseIntPipe,
  UseGuards,
  Post,
} from '@nestjs/common';
import { AccountService } from './account.service.js';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../auth/interface/request.interface.js';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findBelongsToUser(@Request() req: AuthenticatedRequest) {
    return this.accountService.findBelongsToUser(req.user.sub);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) accountId: number,
  ) {
    return this.accountService.findOne(accountId, req.user.sub);
  }

  @Post('personal')
  @UseGuards(AuthGuard('jwt'))
  createPersonalAccount(@Request() req: AuthenticatedRequest) {
    return this.accountService.ensurePersonalAccount(req.user.sub);
  }
}
