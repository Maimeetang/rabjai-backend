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

    // Get raw body
    let rawBody: Buffer | undefined;

    if (req.rawBody) {
      rawBody = req.rawBody;
    } else if (Buffer.isBuffer(req.body)) {
      rawBody = req.body;
    } else if (typeof req.body === 'string') {
      rawBody = Buffer.from(req.body);
    } else if (req.body) {
      rawBody = Buffer.from(JSON.stringify(req.body));
    }

    // Validate signature
    if (!signature || !rawBody) {
      throw new UnauthorizedException('Undefined LINE signature');
    }

    if (!validateSignature(rawBody, channelSecret, signature)) {
      throw new UnauthorizedException('Invalid LINE signature');
    }

    // Parse request body
    let parsedBody: LineBotWebhookRequest;

    if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
      parsedBody = JSON.parse(req.body.toString());
    } else {
      parsedBody = req.body;
    }

    await this.lineWebhookService.handleEvents(parsedBody.events);

    return { message: 'OK' };
  }
}
