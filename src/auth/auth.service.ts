import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';
import { LineAuthService } from './line-auth.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly lineAuthService: LineAuthService,
  ) {}

  async loginWithLine(idToken: string) {
    const lineProfile = await this.lineAuthService.verifyToken(idToken);

    let user = await this.usersService.findByLineUserId(lineProfile.sub);

    if (!user) {
      user = await this.usersService.create({
        lineUserId: lineProfile.sub,
      });
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        role: user.role,
      },
    };
  }
}
