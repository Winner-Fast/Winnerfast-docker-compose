import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export  function jwtValidation(token:string){
    try{
    let secretKey = process.env.TOKEN_SECRET  as string;
    // console.log('essssscret Key:', process.env.TOKEN_SECRET, token);

    let results =  jwt.verify(token, secretKey) as JwtPayload;
    return results
    }catch(e){
        console.log("jwt here", e)
        if (e instanceof jwt.TokenExpiredError) {
            throw new Error('token has expired');
          } else if (e instanceof jwt.JsonWebTokenError) {
            throw new Error('invalid token');
          }
          throw new Error('token verification failed');
    }

}