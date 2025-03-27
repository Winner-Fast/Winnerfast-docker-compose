import * as bcrypt from 'bcrypt';
export async function  hashedpassword(password){
    try{
    const SaltRound = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(password, SaltRound)
    return hashedpassword;
    }catch(e){
        console.log(e);
    }

}