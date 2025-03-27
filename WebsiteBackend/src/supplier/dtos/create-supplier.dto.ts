import { Optional } from '@nestjs/common';
import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDate, Matches, IsDateString } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty({message:"the name of supplier shouldn't be empty"})
  @Matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, { message: "the name of supplier must be valid name" })
  name: string;

  @IsString()
  @IsNotEmpty({message:"Phone number is required"})
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Phone number must be in this format (exemple +212636666666)'})
  phoneNumber: string;

  @IsString({message:"Your address must be string"})
  @IsOptional()
  address: string;

  @IsEnum(['satisfied', 'Not satisfied', 'the best', 'Medium', 'first experience'])
  @Matches(/^(satisfied|Not satisfied|the best|first experience|Medium)$/, { message: "Kindly pick one of the delivery service options :'satisfied', 'Not satisfied', 'the best', 'Medium', 'first experience'" })
  qualityService:string;

  @IsEnum(['same day', '1 day', '2 days', '3 days', '4 days', '1 week', 'more than 1 week'])
  @Matches(/^(same day|1 day|2 days|3 days|4 days|1 week|more than 1 week)$/, { message: "Kindly pick one of the delivery time options;'same day', '1 day', '2 days', '3 days', '4 days', '1 week', 'more than 1 week'" })
  deliveryTime: string

  @IsNumber({},{message:"the total order  must be number" })
  @IsNotEmpty({message: "TOtal orders number is required"})
  totalOrders: number;

  @IsOptional()
  @IsDateString({},{message:"The date has to  be on this format YYYY-MM-DD"})
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "The date must be in the format YYYY-MM-DD" })
  lastOrderDate: Date;
}
