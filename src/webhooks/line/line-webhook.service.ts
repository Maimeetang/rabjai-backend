import { Injectable, Logger } from '@nestjs/common';
import { webhook } from '@line/bot-sdk';

import { LineMessageHandler } from './handlers/line-message.handler.js';
import { LineFollowHandler } from './handlers/line-follow.handler.js';
import { LinePostbackHandler } from './handlers/line-postback.handler.js';

@Injectable()
export class LineWebhookService {
  private readonly logger = new Logger(LineWebhookService.name);

  constructor(
    private readonly messageHandler: LineMessageHandler,
    private readonly followHandler: LineFollowHandler,
    private readonly postbackHandler: LinePostbackHandler,
  ) {}

  async handleEvents(events: webhook.Event[]): Promise<void> {
    for (const event of events) {
      switch (event.type) {
        case 'message':
          await this.messageHandler.handle(event);
          break;

        case 'follow':
          await this.followHandler.handle(event);
          break;

        case 'postback':
          await this.postbackHandler.handle(event);
          break;

        default:
          this.logger.warn(`Unhandled event: ${event.type}`);
      }
    }
  }
}
