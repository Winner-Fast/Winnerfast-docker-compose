import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @UseGuards(UserRoleGuard)
    async addNewProduct(@Body() createProductDto: CreateProductDto, @Req() req) {
        try {
            let result = await this.productService.addNewProduct(createProductDto, req.user.id)
            return result
        } catch (e) {
            console.log("ops there's an error", e)
            throw new BadRequestException("Ops smth went wrong", e)
        }
    }
    @Get()
    @UseGuards(UserRoleGuard)
    async getAllProducts(@Req() req) {
        try {
            return this.productService.getAllProducts(req.user.id);
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new NotFoundException("No product found")
            }
            throw new BadRequestException('Failed to retrieve products');
        }
    }

    @Get(':id')
    @UseGuards(UserRoleGuard)

    async getProductById(@Param('id') id: number, @Req() req) {
        try{
            return this.productService.getProductById(id, req.user.id);
        }catch(e){
            if (e instanceof NotFoundException) {
                throw new NotFoundException("No product found")
            }
            throw new BadRequestException('failed to retrieve products');
        }
    }

    @Put(':id')
    @UseGuards(UserRoleGuard)
    async updateProduct(@Req() req, @Param('id') id: number, @Body() updateProductDto: UpdateProductDto){
        try{
            return this.productService.updateProduct(id, updateProductDto, req.user.id);
        }catch(e){
            console.log(e)
            if (e instanceof NotFoundException) {
                throw new NotFoundException("No product found")
            }
            throw new BadRequestException('failed to retrieve products');
        }
    }

    @Delete(':id')
    @UseGuards(UserRoleGuard)
    async deleteProduct(@Param('id') id: number, @Req() req){
        try{
            let result =await this.productService.deleteProduct(id, req.user.id);
            return 'Product successfully deleted'
        }catch(e){
            console.log('weeeeeeeeeeee',e)
            if (e instanceof NotFoundException) {
                throw new NotFoundException("No product found")
            }
            throw new BadRequestException('Ops smth went wrong');
        }
    }

}



