import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
    constructor(@InjectRepository(Product) private productRepository) { }
    async addNewProduct(createProductDto: CreateProductDto, userid) {
        try {
            createProductDto.userId = userid;
            const product = this.productRepository.create({
                ...createProductDto,
                userId: userid
            });
            const finalResult = await this.productRepository.save(product);
            if (!finalResult) {
                throw new BadRequestException("ops smth went wrong")
            }
            console.log(finalResult)
            return finalResult
        } catch (e) {
            console.log("++++", e)
            throw new BadRequestException("ops smth went wrong")
        }
    }


    async getAllProducts(userId) {
        try {
            let results = await this.productRepository.find({ where: { userId: userId } });
            if (!results || results.length === 0) {
                throw new NotFoundException("No product found")
            }
            console.log(results)
            return results
        } catch (e) {
            console.log("error", e)
            if (e instanceof NotFoundException) {
                throw new NotFoundException("No product found")

            }
            throw new BadRequestException('Failed to retrieve products');
        }
    }

    async getProductById(id: number, userId) {
        try {
            const product = await this.productRepository.findOne({ where: { id: id, userId: userId } });
            if (!product) {
                throw new NotFoundException("Product not found");
            }
            return product;
        } catch (e) {
            console.log("there's an error", e)
            if (e instanceof NotFoundException) {
                throw new NotFoundException("product not found");
            }
            throw new BadRequestException('ops smth went wrong');
        }
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto, userId: number) {
        try {
            const existingProduct = await this.productRepository.findOne({ where: { id: id, userId: userId } });
            if (!existingProduct) {
                throw new NotFoundException('product not found');
            }
            const updatedProduct = await this.productRepository.save({
                ...existingProduct,
                ...updateProductDto
            });
            return updatedProduct;
        } catch(e) {
            if (e instanceof NotFoundException) {
                throw new NotFoundException('product not found');
            }
            console.log('waa error', e);
            throw new BadRequestException('ops smth went wrong in update product');
        }
    }

    async deleteProduct(id: number, userId: number){
        // console.log("+++++=", id, "userrrrrid", userId)
        try {
            const product = await this.productRepository.findOne({where:{ id:id, userId:userId}})

            if (!product) {
                throw new NotFoundException("product not dfound");
            }
            const result = await this.productRepository.delete(id);
            return "Product deleted successfully"
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw e;
            }
            // console.log('Dweee', e);
            throw new BadRequestException('Failed to delete product');
        }
    }

}
