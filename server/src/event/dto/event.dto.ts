import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class PositionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  requirements: string;

  @IsNumber()
  maxParticipants: number;
}

class ContactDto {
  @IsString()
  method: string;

  @IsString()
  value: string;
}

export class CreateEventDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  @Length(3, 20)
  platform: string;

  @Transform(({ value }) => new Date(value))
  @Type(() => Date)
  @IsDate({
    message: 'startDate must be a valid ISO 8601 date string',
    each: true, // Apply the constraint to each item in the array, if it's an array
  })
  startDate: Date;

  @Transform(({ value }) => new Date(value))
  @Type(() => Date)
  @IsDate({
    message: 'endDate must be a valid ISO 8601 date string',
    each: true,
  })
  endDate: Date;

  @Transform(({ value }) => new Date(value))
  @Type(() => Date)
  @IsOptional()
  @IsDate({
    message: 'registrationEndDate must be a valid ISO 8601 date string',
    each: true,
  })
  registrationEndDate?: Date;

  @IsString()
  @Length(3, 255)
  description: string;

  @IsString()
  details: string;

  @IsString()
  location: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  positions: PositionDto[];

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  contacts: ContactDto[];
}
