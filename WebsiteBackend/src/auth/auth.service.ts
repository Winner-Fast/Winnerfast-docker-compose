import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entity/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignupDto } from './dtos/auth/create-register.dto';
import {hashedpassword } from '../utils/hashPassword';
import tokenGenerator from "../utils/tokenGenerator"
import { CheckPassword } from '../utils/checkPassword';
import { plainToClass } from 'class-transformer';
import { ResponseLoginDto } from './dtos/reponse-auth/create-response-login.dto';
import { ResponseRegisterDto } from './dtos/reponse-auth/create-response-register.dto';

@Injectable()
export class AuthService {
  constructor(
    // private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  // constructor(
  //   private jwtService: JwtService,
  //   private entityManager: EntityManager
  // ) {}

  async login(loginDto) {
    try{
      const existingUser = await this.userRepository.findOne({where:{email:loginDto.email}})
      if(!existingUser){
        throw new NotFoundException("The email is not found, kindly try to register before login")
      }
      const isPasswordValid = await CheckPassword(loginDto.password, existingUser.password);
      if (!isPasswordValid) {
        throw new BadRequestException("invalid credentials, please try again");
      }
      if(existingUser.status == "unverified"){
        throw new ForbiddenException("you have to verify your account first")
      }
      const token = await tokenGenerator(existingUser, 24)
      let userinfo =  plainToClass(ResponseLoginDto,existingUser, { excludeExtraneousValues:true, enableImplicitConversion:true}) 
      return {
        userinfo,
        token,
      };
      
      
    }catch(e){
      console.log(e)
      if(e instanceof ForbiddenException){
        throw new ForbiddenException("you have to verify your account first")
      }
      throw new BadRequestException("invalid credentials, please try again")
    }
  }

  async register(registerDto: SignupDto) {
    try{
      const existingUser = await this.userRepository.findOne({ where:{ email: registerDto.email}});
      if(existingUser){
        throw new ConflictException('Email is already registered.');
      }
      let hashpassword = await hashedpassword(registerDto.password);
      if (!hashpassword) {
          return "Verify your password and try again"
      }
      registerDto.password = hashpassword;
      const user = this.userRepository.create(registerDto);
      let result = await this.userRepository.save(user);
      if(result){
        const token = await tokenGenerator(user, 24)
        let userinfo =  plainToClass(ResponseRegisterDto,user, { excludeExtraneousValues:true, enableImplicitConversion:true}) 
        return {
          userinfo,
          token,
        };
      }else{
        throw new BadRequestException("please try again smth went wrong")
      }


    }catch(e){
      console.log('oppppppppps error ',e)
      if(e instanceof ConflictException){
        throw new ConflictException('Email is already registered.')
      }
      throw new BadRequestException("please try again smth went wrong")
    }
}
}
