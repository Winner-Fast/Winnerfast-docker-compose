import { Expose } from "class-transformer";
export class ResponseRegisterDto{

    @Expose()
    id:string
    @Expose()
    firstName:string
    @Expose()
    LastName:string
    @Expose()
    email:boolean
    @Expose()
    role:string
    @Expose()
    verified:string
}
