import { Controller, Post, Body, Request, UseGuards, BadRequestException, ForbiddenException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/auth/create-register.dto';
import { SignInDto } from './dtos/auth/create-login.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: SignInDto) {
    try{
      return await this.authService.login(loginDto)

    }catch(e){
      console.log(e)
      if(e instanceof ForbiddenException || BadRequestException){
        throw e
      }

    }
  }



  @Post('register')
  async register(@Body() registerDto: SignupDto) {
    try{
      return await this.authService.register(registerDto);
    }catch(e){
      console.log("errror", e)
      if(e instanceof ConflictException) throw e
      throw new BadRequestException("please try again smth went wrong")

    }
  }
}
