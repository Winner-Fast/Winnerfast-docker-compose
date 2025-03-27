import { IsString, IsNumber, IsNotEmpty, IsOptional, Min, IsUrl, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsNotEmpty({ message: 'name is required' })
    @IsString({ message: 'Name must be a string' })
    @Matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/, {message: "Your name must be valid name" })
    name: string;

    @IsNotEmpty({message: 'price is required' })
    @IsNumber({}, {message: 'Ppice must be a number' })
    @Min(1, {message: 'price must be valid price' })
    price: number;

    @IsNotEmpty({ message: 'stock is required' })
    @IsNumber({}, {message: 'Stock must be a number' })
    @Min(1, {message: 'stock can t be negative or 0' })
    stock: number;

    @IsOptional()
    @IsUrl({}, {message: 'Invalid image URL' })
    image: string;

    @IsOptional()
    userId:number

}
