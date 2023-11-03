import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @Length(1, 255)
  @IsOptional()
  name: string;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  location: string;
}
