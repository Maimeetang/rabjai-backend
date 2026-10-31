import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service.js';
import { GetUidDto } from './dto/getuid.dto.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  async getProfile(): Promise<GetUidDto> {
    const user_profile = await this.userService.findByLineUserId('test');
    if (!user_profile?.id) {
      return {
        id: 'fail',
      };
    }

    return {
      id: user_profile?.lineUserId,
    };
  }
}
