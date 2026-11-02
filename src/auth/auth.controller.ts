import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from '@nestjs/passport';
import { HttpAdapterHost } from '@nestjs/core';
import type { AuthenticatedRequest } from './interface/request.interface.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  @Post('line')
  @UseGuards(AuthGuard('line'))
  async login(
    @Request() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.login(req.user);

    this.adapterHost.httpAdapter.setCookie(res, 'access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    });

    return {
      message: 'Login successful',
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.adapterHost.httpAdapter.clearCookie(res, 'access_token');

    return {
      message: 'Logout successful',
    };
  }
}
