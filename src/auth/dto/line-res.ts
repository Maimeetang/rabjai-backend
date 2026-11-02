import { IsEmail, IsString } from 'class-validator';

export class LineResponse {
  @IsString()
  sub: string; // User ID for which the ID token was generated.

  /*
  the feilds below are not included 
  if the profile scope wasn't specified 
  in the authorization request.
  */
  @IsString()
  name: string; // User's display name.

  @IsString()
  picture: string; // User's profile image URL.

  @IsEmail()
  email: string; // User's email address.
}
