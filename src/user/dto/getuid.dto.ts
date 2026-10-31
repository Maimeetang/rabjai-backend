import { IsString } from 'class-validator';

export class GetUidDto {
  @IsString()
  id: string;
}
