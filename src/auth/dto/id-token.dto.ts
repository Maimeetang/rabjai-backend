import { IsNotEmpty, IsString } from 'class-validator';

export class IdTokenDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
