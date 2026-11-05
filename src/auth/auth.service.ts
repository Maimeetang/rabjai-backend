import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LineAuthService } from './line-auth.service.js';
import { AuthenticatedUser } from './interface/user.interface.js';
import { UserService } from '../user/user.service.js';
import { AccountService } from '../account/account.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly lineAuthservice: LineAuthService,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
  ) {}

  async validateUser(idToken: string): Promise<AuthenticatedUser> {
    const lineProfile = await this.lineAuthservice.verifyToken(idToken);
    let user = await this.userService.findById(lineProfile.sub);

    if (!user) {
      user = await this.userService.create(
        lineProfile.sub,
        lineProfile.name,
        lineProfile.picture,
      );
    }

    return { sub: user.id, role: user.role };
  }

  async login(user: AuthenticatedUser): Promise<string> {
    const account = await this.accountService.ensurePersonalAccount(user.sub);

    if (!account) {
      throw new InternalServerErrorException(
        'Failed to create personal account',
      );
    }
    return this.jwtService.sign(user);
  }
}
