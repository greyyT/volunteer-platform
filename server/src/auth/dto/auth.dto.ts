import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';
import { IsUsername } from 'src/utils/is-username';

export class SignInDto {
  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsString()
  @Length(8, 255)
  password: string;
}

export class CreateOrganizationDto {
  @IsEmail()
  @Length(1, 255)
  email: string;

  @Length(8, 255)
  password: string;

  @IsUsername()
  @Length(1, 255)
  username: string;

  @IsPhoneNumber('VN')
  @Length(1, 255)
  phone: string;
}

export class CreateUserDto {
  @IsEmail()
  @Length(1, 255)
  email: string;

  @Length(8, 255)
  password: string;

  @IsUsername()
  @Length(1, 255)
  username: string;

  @IsPhoneNumber('VN')
  @Length(1, 255)
  phone: string;
}
