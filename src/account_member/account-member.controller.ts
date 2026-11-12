import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountMemberService } from './account-member.service.js';
import type { AuthenticatedRequest } from '../auth/interface/request.interface.js';

@Controller('accounts')
@UseGuards(AuthGuard('jwt'))
export class AccountMemberController {
  constructor(private readonly memberService: AccountMemberService) {}

  @Get('me')
  findBelongUser(@Req() req: AuthenticatedRequest) {
    return this.memberService.findPersonalAccount(req.user.sub);
  }
}
