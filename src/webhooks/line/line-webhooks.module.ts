import { Module } from '@nestjs/common';
import { LineWebhookController } from './line-webhook.controller.js';
import { LineWebhookService } from './line-webhook.service.js';
import { LineMessageHandler } from './handlers/line-message.handler.js';
import { LineFollowHandler } from './handlers/line-follow.handler.js';
import { UserModule } from '../../user/user.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ConfigModule],
  controllers: [LineWebhookController],
  providers: [LineWebhookService, LineMessageHandler, LineFollowHandler],
})
export class LineWebhookModule {}
