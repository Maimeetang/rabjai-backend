import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LineErrorResponse, LineResponse } from './dto/line-res.js';
import axios from 'axios';

@Injectable()
export class LineAuthService {
  private readonly logger = new Logger(LineAuthService.name);

  constructor(private readonly configService: ConfigService) {}

  async verifyToken(idToken: string): Promise<LineResponse> {
    const clientId = this.configService.getOrThrow<string>('LINE_CHANNEL_ID');

    const body = new URLSearchParams({
      id_token: idToken,
      client_id: clientId,
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
        throw new BadGatewayException('LINE User ID not found');
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError<LineErrorResponse>(error)) {
        this.logger.error(
          'LINE token verification failed',
          JSON.stringify({
            status: error.response?.status,
            error: error.response?.data?.error,
            description: error.response?.data?.error_description,
          }),
        );

        if (error.response?.status === 400) {
          throw new UnauthorizedException('Invalid LINE ID Token');
        }

        throw new BadGatewayException(
          'LINE verification service is unavailable',
        );
      }

      throw error;
    }
  }
}
