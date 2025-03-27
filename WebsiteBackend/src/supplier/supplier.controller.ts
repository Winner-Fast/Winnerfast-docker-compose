import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { SupplierService } from './supplier.service'
import { CreateSupplierDto } from './dtos/create-supplier.dto'
import { UpdateSupplierDto } from './dtos/update-supplier.dto'
import { UserRoleGuard } from '../auth/guards/user-role.guard'

@Controller('supplier')
@UseGuards(UserRoleGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  async create(@Body() createSupplierDto: CreateSupplierDto){
    try{
      return await this.supplierService.create(createSupplierDto)
    } catch (e){
      if (e instanceof ConflictException){
        throw e
      }
      throw new BadRequestException('ops smth went wrong')
    }
  }

  @Get()
  async findAll(){
    try{
      return await this.supplierService.findAll()
    } catch (e){
      if (e instanceof NotFoundException){
        throw e
      }
      throw new BadRequestException('ops smth went wrong in fetching suppliers')
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number){
    try{
      return await this.supplierService.findOne(id)
    } catch (e){
      if (e instanceof NotFoundException){
        throw e
      }
      throw new BadRequestException('Failed to fetch supplier')
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateSupplierDto: UpdateSupplierDto){
    try{
      return await this.supplierService.update(id, updateSupplierDto)
    } catch(e){
      console.log("error",e)
      if (e instanceof NotFoundException){
         throw e
      }
      throw new BadRequestException('ops smth went wrong')
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number){
    try{
      return await this.supplierService.remove(id)
    } catch(e){
      if (e instanceof NotFoundException){
         throw e
        }
      throw new BadRequestException('OPS something went wrong')
    }
  }
}
