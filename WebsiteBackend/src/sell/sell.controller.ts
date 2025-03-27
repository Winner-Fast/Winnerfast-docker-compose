import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common'
import { SellService } from './sell.service'
import { CreateSellDto } from './dtos/create-sell.dto'
import { UpdateSellDto } from './dtos/update-sell.dto'
import { UserRoleGuard } from '../auth/guards/user-role.guard'

@Controller('sell')
@UseGuards(UserRoleGuard)
export class SellController {
  constructor(private readonly sellService: SellService) {}

  @Post()
  async createNewsell(@Body() createSellDto: CreateSellDto, @Req() req) {
    try {
      const userId = req.user.id
      return await this.sellService.createNewSell(createSellDto, userId)
    } catch(e){
      console.log("there's an error", e)
      if (e instanceof NotFoundException || e instanceof BadRequestException) throw e

      throw new BadRequestException("the sell failed")
    }
  }

  @Get()
  async findAll(@Req() req) {
    try {
      const userId = req.user.id
      return await this.sellService.findAll(userId)
    } catch (e) {
      if (e instanceof NotFoundException){
        throw new NotFoundException("No sells found")
      }
      throw new BadRequestException("ops smth went wrong, in showing sells");
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req) {
    try {
      const userId = req.user.id
      return await this.sellService.findOne(id, userId)
    }catch(e){
      if (e instanceof NotFoundException){
        throw new NotFoundException("No sell found")
      }
      if (e instanceof ForbiddenException){
        throw new ForbiddenException("you don't have permission to view the detail of this sell")
      }
      throw new BadRequestException("ops smth wrent Wrong")
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateSellDto:UpdateSellDto, @Req() req) {
    try {
      const userId = req.user.id
      return await this.sellService.update(id, updateSellDto, userId)
    } catch (e) {
      if (e instanceof NotFoundException){
        throw new NotFoundException("sell or product Not Found")
      }
      if (e instanceof ForbiddenException){
        throw new NotFoundException("You aren't allowed to modify those sell informations")
      }
      throw new BadRequestException("ops failed to update")
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    try {
      const userId = req.user.id
      return await this.sellService.remove(id, userId)
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ForbiddenException || e instanceof BadRequestException) throw e
      throw new BadRequestException("Ops smth went wrong we could't delete")
    }
  }
  @Get('/statistics')
  async statistics(){
    return await this.sellService.statistics()
  }
}
