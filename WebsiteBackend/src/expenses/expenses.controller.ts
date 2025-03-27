import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, BadRequestException, UnauthorizedException, NotFoundException, Put, ForbiddenException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { jwtValidation } from 'src/utils/jwtValidation';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @Post()
  @UseGuards(UserRoleGuard)
  async createExpense(@Body() createExpenseDto: CreateExpenseDto, @Req() req) {
    try{
      let token = req.headers['authorization']?.split(" ")[1];
      if(!token){
        throw new UnauthorizedException("ops kidly try to login again")
      }
      let infoUser =jwtValidation(token);
      if(!infoUser){
        throw new UnauthorizedException("ops kidly try to login again")
      }
      await this.expensesService.create(createExpenseDto, infoUser.id)
    }catch(e) {
      console.log("ops creating does't work, please try again ", e)
      if(e instanceof UnauthorizedException){
        throw new UnauthorizedException("ops kidly try to login again")
      }
      throw new BadRequestException("ops smth went wrong")
    }
  }

  @Get()
  @UseGuards(UserRoleGuard)
  findAll(@Req() req){
    try{
      let token = req.headers['authorization']?.split(" ")[1];
      if (!token){
        throw new UnauthorizedException("ops kidly try to login again")
      }
      let infoUser=jwtValidation(token);
      if(!infoUser){
        throw new UnauthorizedException("ops kidly try to login again")
      }
      return this.expensesService.findAllMyExpenses(infoUser.id);
    }catch(e){
      if(e instanceof UnauthorizedException) {
        throw new UnauthorizedException("ops kidly try to login again")
      }
      if(e instanceof NotFoundException){
        throw new NotFoundException("No expenses yet")
      }
      throw new BadRequestException("ops smth bad happend")
    }
  }

  @Get(':id')
  @UseGuards(UserRoleGuard)
  async findOne(@Param('id') id: number, @Req() req) {
    try{
      const userId = req.user.id;
      return await this.expensesService.findOneExpense(id, userId);
    }catch(e){
      console.log("oooops there's an error", e);
      if(e instanceof NotFoundException){
        throw e;
      }
      if(e instanceof ForbiddenException){
        throw e;
      }
      throw new BadRequestException("ops smth wrong happened");
    }
  }

  @Put(':id')
  @UseGuards(UserRoleGuard)
  update(@Param('id') id: number, @Body() updateExpenseDto: UpdateExpenseDto, @Req() req) {
    try{
      const userId = req.user.id;
      return this.expensesService.updateExpense(id, updateExpenseDto, userId);
    }catch(e){
      console.log("there's an error", e);
      if(e instanceof NotFoundException){
        throw e;
      }
      throw new BadRequestException("ops it failed to update expense");
    }
  }

  @Delete(':id')
  @UseGuards(UserRoleGuard)
  async remove(@Param('id')id: number, @Req() req) {
    try{
      const userId = req.user.id;
      return await this.expensesService.removeExpense(id, userId);
    }catch(e){
      console.log("there's an error", e);
      if(e instanceof NotFoundException){
        throw e;
      }
      throw new BadRequestException("ops smth went wrong");
    }
  }
}
