import {
  Controller,
  Get,
  NotFoundException,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/interface/request.interface.js';
import { GetProfileResDto } from './dto/getprofile-res.dto.js';
import { UserService } from './user.service.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<GetProfileResDto> {
    const user = await this.userService.findById(req.user.sub);

    if (!user) {
      throw new NotFoundException(`User with ID: ${req.user.sub} not found`);
    }

    return {
      id: user.id,
      name: user.name,
      role: user.role,
    };
  }
}
