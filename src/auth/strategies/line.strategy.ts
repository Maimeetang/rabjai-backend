import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth.service.js';
import { AuthenticatedUser } from '../interface/user.interface.js';

@Injectable()
export class LineStrategy extends PassportStrategy(Strategy, 'line') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<AuthenticatedUser> {
    const idToken = req.body?.idToken;

    if (!idToken) {
      throw new UnauthorizedException();
    }

    const user = await this.authService.validateUser(idToken);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
