import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '@/user/user.service.js';
import { ConfigService } from '@nestjs/config';
import { LineBotClient, webhook } from '@line/bot-sdk';

@Injectable()
export class LineFollowHandler {
  private readonly logger = new Logger(LineFollowHandler.name);

  constructor(
    private readonly userService: UserService,
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

      await this.userService.create(
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
