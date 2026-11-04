import { Module } from '@nestjs/common';
import { LineWebhookController } from './line-webhook.controller.js';
import { LineWebhookService } from './line-webhook.service.js';

@Module({
  controllers: [LineWebhookController],
  providers: [LineWebhookService],
})
export class LineWebhookModule {}
