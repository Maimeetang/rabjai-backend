import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LineResponse } from './dto/line-res.js';
import axios from 'axios';

@Injectable()
export class LineAuthService {
  constructor(private readonly configService: ConfigService) {}

  async verifyToken(idToken: string): Promise<LineResponse> {
    const client_id = this.configService.get<string>('LINE_CHANNEL_ID');
    if (!client_id) {
      throw new Error('LINE_CHANNEL_ID is not configured');
    }

    const body = new URLSearchParams({
      id_token: idToken,
      client_id: client_id,
    });

    try {
      const { data } = await axios.post<LineResponse>(
        'https://api.line.me/oauth2/v2.1/verify',
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      if (!data.sub) {
        throw new UnauthorizedException('LINE User ID not found');
      }

      return data;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        throw new UnauthorizedException('LINE ID Token is not valid');
      }

      throw error;
    }
  }
}
