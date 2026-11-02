import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { GetProfileResDto } from './dto/getprofile-res.dto.js';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from '../auth/interface/request.interface.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<GetProfileResDto> {
    const user = await this.userService.findById(req.user.sub);
    return {
      id: user.id,
      lineUserId: user.lineUserId,
      name: user.name,
      pictureUrl: user.pictureUrl,
      role: user.role,
    };
  }
}
