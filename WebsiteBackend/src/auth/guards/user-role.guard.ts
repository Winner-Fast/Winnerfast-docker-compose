import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError } from '@nestjs/jwt';
import { jwtValidation } from '../../utils/jwtValidation';

@Injectable()
export class UserRoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        try{
            const request = context.switchToHttp().getRequest();
            const token = request.headers['authorization']?.split(' ')[1];
            if(!token){
                throw new UnauthorizedException('kindly try to login again');
            }
            const infoUser = jwtValidation(token);
            // console.log('user Info:', infoUser);

            if(infoUser.role !== 'user'){
                throw new ForbiddenException('osp only business owners can perform this');
            }
            request.user = infoUser;
            return true; 
        } catch(e){
            console.log("++++++++++", e);
            if(e instanceof ForbiddenException){
                throw new ForbiddenException('Admins cannot perform this action, only business owners can');
            }
            if(e instanceof JsonWebTokenError){
                throw new UnauthorizedException('please try to login');
            }
            throw new UnauthorizedException('Please try to logiin again');
        }
    }
}
