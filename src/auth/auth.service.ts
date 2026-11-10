import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LineAuthService } from './line-auth.service.js';
import { AuthenticatedUser } from './interface/user.interface.js';
import { RegistrationService } from '@/registration/registration.service.js';
import { UserService } from '@/user/user.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly lineAuthservice: LineAuthService,
    private readonly userService: UserService,
    private readonly registrationService: RegistrationService,
  ) {}

  async validateUser(idToken: string): Promise<AuthenticatedUser> {
    const lineProfile = await this.lineAuthservice.verifyToken(idToken);
    let user = await this.userService.findById(lineProfile.sub);

    if (!user) {
      user = await this.registrationService.register(
        lineProfile.sub,
        lineProfile.name,
      );
    }

    return { sub: user.id, role: user.role };
  }

  async login(user: AuthenticatedUser): Promise<string> {
    return this.jwtService.sign(user);
  }
}
