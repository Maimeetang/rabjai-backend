import { Module } from '@nestjs/common';
import { LineWebhookController } from './line-webhook.controller.js';
import { LineWebhookService } from './line-webhook.service.js';
import { LineMessageHandler } from './handlers/line-message.handler.js';
import { LineFollowHandler } from './handlers/line-follow.handler.js';
import { UserModule } from '@/user/user.module.js';
import { ConfigModule } from '@nestjs/config';
import { RegistrationModule } from '@/registration/registration.module.js';
import { AccountMemberModule } from '@/account_member/account-member.module.js';
import { CategoryModule } from '@/category/category.module.js';
import { GeminiModule } from '@/gemini/gemini.module.js';

@Module({
  imports: [
    UserModule,
    RegistrationModule,
    ConfigModule,
    AccountMemberModule,
    CategoryModule,
    GeminiModule,
  ],
  controllers: [LineWebhookController],
  providers: [LineWebhookService, LineMessageHandler, LineFollowHandler],
})
export class LineWebhookModule {}
