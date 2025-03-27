import { IsDefined, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, MaxLength, IsDate, Matches } from 'class-validator';

export class CreateExpenseDto {
    @IsString({message:"The operation name must be string"})
    @MaxLength(255, { message: "The operation name should" })
    @Matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, { message: "Your operation name must be valid name" })
    
    operationName: string;

    @IsNotEmpty({ message: "The expense type is required" })
    @IsEnum(['fixed', 'variable'], { message: "Type must be either 'fixed' or 'variable'" })
    type: 'fixed' | 'variable'; 

    @IsNotEmpty({ message: "Amount is required" })
    @IsNumber({}, { message: "Amount must be a number" })
    amount: number;

    @IsNotEmpty({ message: "Date is required" })
    date: string;

    @IsOptional()
    @IsString()
    @MaxLength(255, { message: "description cannot exceed 255 characters" })
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255, { message: "category cannot exceed 255 characters" })
    @Matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, { message: "Your catgeory must be valid name" })

    category?: string;


    // @IsNotEmpty({ message: "User ID is required" })
    // @IsNumber()
    @IsOptional()
    userId: number;



}
