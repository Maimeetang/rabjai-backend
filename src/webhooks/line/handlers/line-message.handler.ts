import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { LineBotClient, webhook } from '@line/bot-sdk';
import { CategoryService } from '@/category/category.service.js';
import { AccountMemberService } from '@/account_member/account-member.service.js';
import { GeminiService } from '@/gemini/gemini.service.js';
import { ConfigService } from '@nestjs/config';
import { TransactionService } from '@/transaction/transaction.service.js';
import { createTransactionFlexMessage } from '../flex_messages/createtransaction-message.js';
import { TransactionParserResult } from '@/gemini/dto/transaction-parser.dto.js';

@Injectable()
export class LineMessageHandler {
  private readonly logger = new Logger(LineMessageHandler.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly accountMemberService: AccountMemberService,
    private readonly categoryService: CategoryService,
    private readonly transactionService: TransactionService,
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

    const replyToken = event.replyToken;
    if (!replyToken) {
      throw new BadGatewayException('replyToken is undefined');
    }

    // Check text message
    if (event.message.type !== 'text') {
      await client.replyMessage({
        replyToken: replyToken,
        messages: [
          {
            type: 'text',
            text: 'ระบบยังรองรับแค่การส่งแบบข้อความธรรมดานะครับ 😅',
          },
        ],
      });
      return;
    }

    if (!event.source?.type || !event.source?.userId) {
      throw new BadGatewayException(
        'message event source type or user is undefined',
      );
    }

    const userId = event.source.userId;
    const message = event.message.text;

    let chatId = userId;
    let account;

    if (event.source.type === 'user') {
      chatId = userId;
      account = await this.accountMemberService.findPersonalAccount(userId);
    }

    // if (event.source.type === 'group') {
    //   const groupId = event.source.groupId;
    //   chatId = groupId;
    //   // account = await this.accountMemberService.findGroupAccount(groupId);
    // }

    if (!account) {
      return;
    }

    const categories = await this.categoryService.findByAccountId(account.id);

    // Show loading animation
    await client.showLoadingAnimation({
      chatId: chatId,
      loadingSeconds: 20,
    });

    // Parse message using Gemini
    let results: TransactionParserResult;

    try {
      results = await this.geminiService.parseTransaction(message, categories);
    } catch (error) {
      this.logger.error(
        'Gemini API failed',
        error instanceof Error ? error.stack : String(error),
      );

      await client.replyMessage({
        replyToken,
        messages: [
          {
            type: 'text',
            text: 'ไม่สามารถบันทึกรายการได้ กรุณาลองใหม่อีกครั้งนะครับ 😅',
          },
        ],
      });

      return;
    }

    switch (results.status) {
      case 'SUCCESS': {
        // this.logger.debug(`Parsed transaction: ${JSON.stringify(results)}`);

        try {
          const transactions = await Promise.all(
            results.data.map(async (result) => {
              const category = categories.find(
                (category) => category.id === result.categoryId,
              );

              // this.logger.debug(`category: ${JSON.stringify(category)}`);

              if (!category) {
                throw new BadGatewayException('Category not found');
              }

              const transaction = await this.transactionService.create(
                result.categoryId,
                userId,
                {
                  amount: result.amount,
                  description: result.description,
                  transactionDate: new Date().toISOString(),
                },
              );

              return {
                ...transaction,
                category: {
                  name: category.name,
                  type: result.type,
                },
              };
            }),
          );

          await client.replyMessage({
            replyToken,
            messages: [createTransactionFlexMessage(transactions)],
          });
        } catch (error) {
          this.logger.error(
            'Failed to create transactions',
            error instanceof Error ? error.stack : String(error),
          );

          await client.replyMessage({
            replyToken,
            messages: [
              {
                type: 'text',
                text: 'ไม่สามารถบันทึกรายการได้ กรุณาลองใหม่อีกครั้งนะครับ 😅',
              },
            ],
          });

          return;
        }

        break;
      }

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
