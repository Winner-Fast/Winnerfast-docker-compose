import {IsString,IsNumber,IsNotEmpty,IsArray,Min, IsOptional, Matches} from 'class-validator';

export class CreateSellDto {
    @IsNotEmpty({ message: 'Operation name is required'})
    @IsString({ message: 'operation name must be a string'})
    @Matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, {message: "Your name must be valid name"})
    operationName: string;

    @IsNotEmpty({ message: 'Total amount is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'total amount must be a valid number ' })
    @Min(1, { message: 'total amount must be a positive number'})
    totalAmount: number;

    @IsNotEmpty({ message: 'quantity is required'})
    @IsNumber({}, { message: 'quantity must be a number'})
    @Min(1, { message: 'quantity must be at least 1'})
    quantity: number;

    // @IsNotEmpty({ message: 'userId is required'})
    // @IsNumber({}, { message: 'user ID must be a number'})
    // userId: number;

    @IsNotEmpty({ message: 'products are required'})
    @IsNumber({}, { message: 'product Id must be a number '})
    productIds: number;
}