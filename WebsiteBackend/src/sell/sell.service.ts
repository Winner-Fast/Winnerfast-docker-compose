import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {  DataSource, Repository } from 'typeorm'
import { Sell } from './entities/sell.entity'
import { CreateSellDto } from './dtos/create-sell.dto'
import { UpdateSellDto } from './dtos/update-sell.dto'
import { Product } from 'src/product/entities/product.entity'

@Injectable()
export class SellService {
  constructor(@InjectRepository(Sell) private sellRepository: Repository<Sell>,
              @InjectRepository(Product) private productRepository: Repository<Product>,
              private dataSource: DataSource,
            ){}

  async createNewSell(createSellDto: CreateSellDto, userId: number){
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      let productCheck = await this.productRepository.findOne({where: {id: createSellDto.productIds}})
      if(! productCheck){
        throw new NotFoundException("ops The Product is not dound")
      }
      if(productCheck.stock < createSellDto.quantity){
        throw new BadRequestException("ops this quantity is not available in the stock of product please check again")
      }
      productCheck.stock -= createSellDto.quantity;
      await this.productRepository.save(productCheck);
      const sell = this.sellRepository.create({
        ...createSellDto,
        userId,
        products:[productCheck]
      })
      let result = await this.sellRepository.save(sell)
      await queryRunner.commitTransaction();
      return result
    } catch (e){
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      console.log("sell err",e)
      if (e instanceof NotFoundException){
        throw e
      }
      if(e instanceof BadRequestException){
        throw e 
      }

      throw new BadRequestException("ops the sell wasn't added")
    }
  }

  async findAll(userId: number) {
    try {
      const sells = await this.sellRepository.find({
        where: { userId },
        relations:['products']
      });
      
      if (!sells || sells.length === 0) {
        throw new NotFoundException("No sells found")
      }
      
      return sells;
    } catch (e){
      // console.log("er ++++", e)
      if (e instanceof NotFoundException){
        throw new NotFoundException("No sells found")
      }
      throw new BadRequestException("ops smth went wrong")
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const sell = await this.sellRepository.findOne({
        where:{id:id},
        relations:['products']
      });

      if (!sell) {
        throw new NotFoundException("Sell not found");
      }

      if (sell.userId !== userId) {
        throw new ForbiddenException("you don't have permission to view the detail of this sell");
      }

      return sell;
    } catch (e){
      console.log(e)
      if (e instanceof NotFoundException){
        throw new NotFoundException("no sell found")
      }
      if (e instanceof ForbiddenException){
        throw new ForbiddenException("you don't have permission to view the detail of this sell")
      }
      throw new BadRequestException("ops smth went Wrong ");
    }
  }

  async update(id: number, updateSellDto: UpdateSellDto, userId: number) {
    try {
      let productCheck = await this.productRepository.findOne({where: {id: updateSellDto.productIds}})
      if(!productCheck){
        throw new NotFoundException("ops The Product is not found")
      }
      const sell = await this.sellRepository.findOne({
        where:{id},
        relations: ['products']
      })
      console.log(sell)
      if (!sell) {
        throw new NotFoundException("sell not found")
      }
      if (sell.userId !== userId) {
        throw new ForbiddenException("You aren't allowed to modify those sell informations")
      }
      const updatedSell = {
        ...sell,
        ...updateSellDto,
        products: [productCheck],
        userId: userId
      };
      return await this.sellRepository.save(updatedSell);

    } catch (e) {
      console.log("update errorrrr", e)
      if (e instanceof NotFoundException){
        throw new NotFoundException("sell or product Not Found")
      }
      if (e instanceof ForbiddenException){
        throw new NotFoundException("You aren't allowed to modify those sell informations")
      }
      throw new BadRequestException("ops failed to update")
    
    }
  }

  async remove(id: number, userId: number) {
    try {
      const sell = await this.sellRepository.findOne({
        where: { id }
      })

      if (!sell) {
        throw new NotFoundException("sell not found")
      }

      if (sell.userId !== userId) {
        throw new ForbiddenException("you don't have permission to delete this sell record")
      }

      let result = await this.sellRepository.delete(id)
      return "sell deleted successfully"
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ForbiddenException) throw e
      throw new BadRequestException("ops smth went wrong")
    }
  }
  async statistics(){
    try {
      let result = await this.dataSource.query(
        `SELECT SUM("totalAmount") AS "total_sell_amount" FROM public.sell`
      );
      console.log(result);
      return result;
    } catch (e) {
      throw new BadRequestException("Oops, no statistics available.");
    }
  }
}
