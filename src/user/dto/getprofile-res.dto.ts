import { IsNumber, IsString } from 'class-validator';

export class GetProfileResDto {
  @IsNumber()
  id: number;

  @IsString()
  lineUserId: string;

  @IsString()
  name: string;

  @IsString()
  pictureUrl: string;

  @IsString()
  role: string;
}
