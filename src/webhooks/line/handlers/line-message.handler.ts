import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { LineBotClient, webhook } from '@line/bot-sdk';
import { CategoryService } from '@/category/category.service.js';
import { AccountMemberService } from '@/account_member/account-member.service.js';
import { GeminiService } from '@/gemini/gemini.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LineMessageHandler {
  private readonly logger = new Logger(LineMessageHandler.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly accountService: AccountMemberService,
    private readonly categoryService: CategoryService,
    private readonly geminiService: GeminiService,
  ) {}

  async handle(event: webhook.MessageEvent): Promise<void> {
    this.logger.log('Message event');

    const channelAccessToken = this.configService.getOrThrow<string>(
      'LINE_CHANNEL_ACCESS_TOKEN',
    );

    const client = LineBotClient.fromChannelAccessToken({
      channelAccessToken,
    });

    if (!event.source?.type || !event.source?.userId) {
      throw new BadGatewayException(
        'message event source type or user is undefined',
      );
    }

    // Check private chat
    if (event.source.type !== 'user') {
      return;
    }

    // Check text message
    if (event.message.type !== 'text') {
      return;
    }

    const userId = event.source.userId;
    const message = event.message.text;
    const replyToken = event.replyToken;

    if (!replyToken) {
      throw new BadGatewayException('replyToken is undefined');
    }

    const account = await this.accountService.findPersonalAccount(userId);
    const categories = await this.categoryService.findByAccountId(account.id);

    // Show loading animation
    await client.showLoadingAnimation({
      chatId: userId,
      loadingSeconds: 20,
    });

    // Parse message using Gemini
    const result = await this.geminiService.parseTransaction(
      message,
      categories,
    );

    switch (result.status) {
      case 'SUCCESS':
        this.logger.log(`Parsed transaction: ${JSON.stringify(result)}`);

        // TODO: Create transaction
        break;

      case 'INVALID':
        await client.replyMessage({
          replyToken: replyToken,
          messages: [
            {
              type: 'text',
              text: 'ยังไม่เข้าใจรายการเลย 😅 ลองบอกใหม่อีกครั้งนะ เช่น กะเพรา 50 บาท',
            },
          ],
        });
        break;
    }
  }
}
