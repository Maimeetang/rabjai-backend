import { webhook } from '@line/bot-sdk';

export interface LineBotResponse {
  destination: string;
  events: webhook.Event[];
}
