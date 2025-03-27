import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Supplier } from './entities/supplier.entity'
import { CreateSupplierDto } from './dtos/create-supplier.dto'
import { UpdateSupplierDto } from './dtos/update-supplier.dto'

@Injectable()
export class SupplierService {
  constructor(@InjectRepository(Supplier) private supplierRepository: Repository<Supplier>){}

  async create(createSupplierDto: CreateSupplierDto){
    try {
      const existingSupplier= await this.supplierRepository.findOne({
        where:[{ 
            name: createSupplierDto.name,
            phoneNumber: createSupplierDto.phoneNumber 
          }]
      })
      if (existingSupplier) {
        throw new ConflictException('supplier with this name and phonenumber already exists')
      }
      const supplier =this.supplierRepository.create(createSupplierDto)
      return await this.supplierRepository.save(supplier)
    } catch (e){
      console.log("errr", e)
      if ( e instanceof ConflictException){
        throw e
      }
      throw new BadRequestException('ops something went wrong in creation');
    }
  }

  async findAll(){
    try {
      const suppliers= await this.supplierRepository.find()
      if (!suppliers || suppliers.length == 0 ){
        throw new NotFoundException('No suppliers found')
      }
      return suppliers
    } catch (e){
      if (e instanceof NotFoundException){
         throw e
        }
      throw new BadRequestException('ops smth went wrooong')
    }
  }

  async findOne(id: number){
    try {
      const supplier = await this.supplierRepository.findOne({where:{id:id}})
      if (!supplier){
        throw new NotFoundException('supplier not found')
      }
      return supplier
    } catch(e){
      if (e instanceof NotFoundException){
        throw e
      }
      throw new BadRequestException('ops error')
    }
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto){
    try {
      const supplier = await this.supplierRepository.findOne({where:{id:id}})
      if (!supplier){
        throw new NotFoundException('Supplier not found')
      }
      await this.supplierRepository.update(id, updateSupplierDto)
      return await this.supplierRepository.findOne({where:{id:id }})
    } catch (e) {
      if (e instanceof NotFoundException){
         throw e
        }
      throw new BadRequestException('ops smth went wrong')
    }
  }

  async remove(id: number) {
    try {
      const supplier = await this.supplierRepository.findOne({where:{id:id}})
      if (!supplier) {
        throw new NotFoundException('Supplier not found')
      }
      await this.supplierRepository.delete(id)
      return 'deleted successfully'
    } catch (e) {
      if (e instanceof NotFoundException){
         throw e
        }
      throw new BadRequestException('ops smth went wrong')
    }
  }


}
