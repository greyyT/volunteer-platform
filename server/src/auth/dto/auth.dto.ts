import { IsEmail, Length } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @Length(1, 255)
  email: string;

  @Length(8, 255)
  password: string;
}
