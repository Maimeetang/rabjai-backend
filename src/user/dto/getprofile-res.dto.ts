import { IsString } from 'class-validator';

export class GetProfileResDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  role: string;
}
