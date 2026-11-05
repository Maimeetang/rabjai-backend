import {
  Controller,
  Post,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';

import { validateSignature } from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';

import { LineWebhookService } from './line-webhook.service.js';
import { LineBotWebhookRequest } from './dto/linebot-req.dto.js';

@Controller('webhooks/line')
export class LineWebhookController {
  constructor(
    private readonly lineWebhookService: LineWebhookService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req()
    req: RawBodyRequest<Request<unknown, unknown, LineBotWebhookRequest>>,
    @Headers('x-line-signature') signature: string,
  ) {
    const channelSecret = this.configService.getOrThrow<string>(
      'LINE_CHANNEL_SECRET',
    );

    if (!signature || !req.rawBody) {
      throw new UnauthorizedException('Invalid LINE signature');
    }

    if (!validateSignature(req.rawBody, channelSecret, signature)) {
      throw new UnauthorizedException('Invalid LINE signature');
    }

    await this.lineWebhookService.handleEvents(req.body.events);

    return { message: 'OK' };
  }
}
