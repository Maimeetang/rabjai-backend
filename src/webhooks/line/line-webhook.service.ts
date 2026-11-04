import { Injectable, Logger } from '@nestjs/common';
import { webhook } from '@line/bot-sdk';

@Injectable()
export class LineWebhookService {
  private readonly logger = new Logger(LineWebhookService.name);

  async handleEvents(events: webhook.Event[]): Promise<void> {
    for (const event of events) {
      switch (event.type) {
        case 'message':
          this.logger.log('Message event');
          break;

        case 'follow':
          this.logger.log('Follow event');
          break;

        // case 'unfollow':
        //   this.logger.log('Unfollow event');
        //   break;

        // case 'join':
        //   this.logger.log('Join event');
        //   break;

        // case 'leave':
        //   this.logger.log('Leave event');
        //   break;

        // case 'memberJoined':
        //   this.logger.log('Member joined event');
        //   break;

        // case 'memberLeft':
        //   this.logger.log('Member left event');
        //   break;

        default:
          this.logger.warn(`Unhandled event: ${event.type}`);
      }
    }
  }
}
