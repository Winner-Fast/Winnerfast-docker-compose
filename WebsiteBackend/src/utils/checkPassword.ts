import * as bcrypt from "bcrypt"
export async function CheckPassword(password, hash){
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch
}