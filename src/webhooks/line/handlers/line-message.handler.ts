import { Injectable, Logger } from '@nestjs/common';
import { webhook } from '@line/bot-sdk';

@Injectable()
export class LineMessageHandler {
  private readonly logger = new Logger(LineMessageHandler.name);

  async handle(event: webhook.MessageEvent): Promise<void> {
    this.logger.log('Message event');

    // Handle message
    console.log(event.message);
  }
}
