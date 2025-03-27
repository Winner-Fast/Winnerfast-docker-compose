import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength,Matches } from 'class-validator';

export class SignInDto {

  @IsNotEmpty({ message:"The email can not be empty kindly add your email" })
  @IsEmail({},{ message:"The email format is incorrect, kindly use a valid email" })
  email: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty({ message:"Your Password is required"})
  password: string;
}
