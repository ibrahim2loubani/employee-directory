import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(15)
  phone: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  department: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  location: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsDateString()
  dateOfBirth: string;

  @IsDateString()
  hireDate: string;

  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return Number(value);
    }
    return value;
  })
  @IsNumber()
  @Min(0)
  @Max(1000000)
  salary: number;

  @IsEnum(['active', 'inactive'])
  status: 'active' | 'inactive';
}
