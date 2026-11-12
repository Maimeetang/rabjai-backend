import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { LineBotClient, webhook } from '@line/bot-sdk';
import { TransactionService } from '../../../transaction/transaction.service.js';
import { ConfigService } from '@nestjs/config';
import { deleteTransactionFlexMessage } from '../flex_messages/deletetransaction-message.js';

@Injectable()
export class LinePostbackHandler {
  private readonly logger = new Logger(LinePostbackHandler.name);

  constructor(
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService,
  ) {}

  async handle(event: webhook.PostbackEvent): Promise<void> {
    const params = new URLSearchParams(event.postback.data);

    const channelAccessToken = this.configService.getOrThrow<string>(
      'LINE_CHANNEL_ACCESS_TOKEN',
    );

    const client = LineBotClient.fromChannelAccessToken({
      channelAccessToken,
    });

    const replyToken = event.replyToken;
    if (!replyToken) {
      throw new BadGatewayException('replyToken is undefined');
    }

    const userId = event.source?.userId;
    if (!userId) {
      throw new BadGatewayException(
        'message event source user ID is undefined',
      );
    }

    let chatId = userId;

    switch (params.get('action')) {
      case 'delete_transaction': {
        this.logger.log('Delete action event');

        // Show loading animation
        await client.showLoadingAnimation({
          chatId: chatId,
          loadingSeconds: 20,
        });

        const transactionId = Number(params.get('id'));

        if (!Number.isInteger(transactionId) || transactionId <= 0) {
          this.logger.warn('Invalid transaction ID');
          return;
        }

        try {
          const transaction = await this.transactionService.delete(
            transactionId,
            userId,
          );

          // this.logger.log(`${JSON.stringify(transaction)}`);

          await client.replyMessage({
            replyToken,
            messages: [deleteTransactionFlexMessage(transaction)],
          });
        } catch (error) {
          if (error instanceof NotFoundException) {
            this.logger.warn(`Transaction ${transactionId} not found`);

            await client.replyMessage({
              replyToken,
              messages: [
                {
                  type: 'text',
                  text: 'ไม่พบข้อมูลที่ต้องการจะลบ 😅',
                },
              ],
            });
          }

          throw error;
        }

        break;
      }

      default:
        this.logger.warn(`Unhandled postback: ${event.postback.data}`);
    }
  }
}
