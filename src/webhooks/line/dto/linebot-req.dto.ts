import { webhook } from '@line/bot-sdk';
import { IsArray, IsString } from 'class-validator';

export class LineBotWebhookRequest {
  @IsString()
  destination: string;

  @IsArray()
  events: webhook.Event[];
}
