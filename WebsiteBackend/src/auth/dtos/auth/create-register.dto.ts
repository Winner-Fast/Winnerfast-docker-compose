import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength,Matches } from 'class-validator';

export class SignupDto {
  @IsNotEmpty({message:"the first name is required"})
  @IsString()
  @MinLength(3)
  @Matches(/^[A-Za-z]+$/, { message: "Your firstname must contain only letters" })
  firstName: string;

  @IsNotEmpty({message:"the last name is required"})
  @IsString()
  @Matches(/^[A-Za-z]+$/, { message: "Your lastName must contain only letters" })
  @MinLength(3)
  lastName: string;

  @IsNotEmpty({ message:"The email can not be empty kindly add your email" })
  @IsEmail({},{ message:"The email format is incorrect, kindly use a valid email" })
  email: string;

  @MinLength(6)
  @IsNotEmpty({ message:"Your Password is required"})
  password: string;
}
