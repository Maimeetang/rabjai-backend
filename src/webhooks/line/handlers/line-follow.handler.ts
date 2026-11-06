import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '@/user/user.service.js';
import { ConfigService } from '@nestjs/config';
import { LineBotClient, webhook } from '@line/bot-sdk';
import { RegistrationService } from '@/registration/registration.service.js';

@Injectable()
export class LineFollowHandler {
  private readonly logger = new Logger(LineFollowHandler.name);

  constructor(
    private readonly userService: UserService,
    private readonly registrationService: RegistrationService,
    private readonly configService: ConfigService,
  ) {}

  async handle(event: webhook.FollowEvent): Promise<void> {
    const channelAccessToken = this.configService.getOrThrow<string>(
      'LINE_CHANNEL_ACCESS_TOKEN',
    );

    const client = LineBotClient.fromChannelAccessToken({
      channelAccessToken,
    });

    const userId = event.source?.userId;

    if (!userId) {
      this.logger.warn(`event error: ${event.type}`);
      throw new BadGatewayException('linking the account has failed');
    }

    let user = await this.userService.findById(userId);

    if (!user) {
      const profile = await client.getProfile(userId);

      user = await this.registrationService.register(
        profile.userId,
        profile.displayName,
        profile.pictureUrl,
      );
    } else {
      this.logger.log('this user already exists');
    }

    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: 'text',
          text: 'ยินดีต้อนรับสู่ RubJai!',
        },
      ],
    });
  }
}
