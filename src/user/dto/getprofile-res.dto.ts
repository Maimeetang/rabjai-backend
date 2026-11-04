import { IsNumber, IsString } from 'class-validator';

export class GetProfileResDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  pictureUrl: string;

  @IsString()
  role: string;
}
