import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LineAuthService } from './line-auth.service.js';
import { AuthenticatedUser } from './interface/user.interface.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly lineAuthservice: LineAuthService,
    private readonly usersService: UserService,
  ) {}

  async validateUser(idToken: string): Promise<AuthenticatedUser> {
    const lineProfile = await this.lineAuthservice.verifyToken(idToken);
    let user = await this.usersService.findById(lineProfile.sub);

    if (!user) {
      user = await this.usersService.create(
        lineProfile.sub,
        lineProfile.name,
        lineProfile.picture,
      );
    }

    return { sub: user.id, role: user.role };
  }

  async login(user: AuthenticatedUser): Promise<string> {
    return this.jwtService.sign(user);
  }
}
