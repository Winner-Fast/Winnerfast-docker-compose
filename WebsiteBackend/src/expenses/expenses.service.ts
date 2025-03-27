import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExpensesService{
  constructor(@InjectRepository(Expense) private expenseRepository: Repository<Expense>){}
  async create(createExpenseDto: CreateExpenseDto, userId) {
    try {
      createExpenseDto.userId = userId;
      let result = this.expenseRepository.create(createExpenseDto)
      const expense = this.expenseRepository.create({
        ...createExpenseDto,
        date: new Date(createExpenseDto.date),
      });
      const finalResult = await this.expenseRepository.save(expense);
      if (!finalResult) {
        throw new BadRequestException("ops smth went wrong")
      }
      console.log(finalResult)
      return finalResult
    } catch (e) {
      throw new BadRequestException("ops smth went wrong")
    }
  }

  async findAllMyExpenses(userId) {
    try {
      let result = await this.expenseRepository.find({ where: { userId } });
      //  console.log(result);
      if (!result || result.length == 0) {
        throw new NotFoundException("No expenses yet")
      }
      return result
    } catch (e) {
      // console.log("eeee", e)
      if (e instanceof NotFoundException) {
        throw new NotFoundException("No expenses yet")
      }
      throw new BadRequestException("Ops smth went wrong")
    }
  }

  async findOneExpense(id: number, userId: number){
    try{
      const expense = await this.expenseRepository.findOne({where:{id}});
      if(!expense){
        throw new NotFoundException("expense not found");
      }

      if(expense.userId !== userId){
        throw new ForbiddenException("You are not authorized to view this expense");
      }
      return expense;
    }catch(e) {
      if(e instanceof NotFoundException || e instanceof ForbiddenException){
        throw e;
      }
      throw new BadRequestException("Failed to fetch expense");
    }
  }

  async updateExpense(id: number, updateExpenseDto: UpdateExpenseDto, userId: number) {
    try {
      const expense=await this.expenseRepository.findOne({ where:{id, userId}});
      if(!expense){
        throw new NotFoundException("expense not found");
      }
      await this.expenseRepository.update(id, updateExpenseDto);
      return await this.expenseRepository.findOne({ where:{ id }});
    }catch(e){
      if(e instanceof NotFoundException){
        throw e;
      }
      throw new BadRequestException("ops smth bad happend because it failed to update expense");
    }
  }

  async removeExpense(id: number, userId: number) {
    try {
      const expense= await this.expenseRepository.findOne({where:{id}});
      if (!expense) {
        throw new NotFoundException("expense not found");
      }
      if (expense.userId !== userId) {
        throw new ForbiddenException("you aren't allowed to delete this expense");
      }

      await this.expenseRepository.delete(id)
      return "expense deleted successfully" 
    }catch(e){
      if(e instanceof NotFoundException || e instanceof ForbiddenException){
        throw e;
      }
      throw new BadRequestException("ops ops failed to delete expense");
    }
  }
}
