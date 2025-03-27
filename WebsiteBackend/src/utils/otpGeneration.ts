import * as crypto from "crypto"

async function OTPGenerator(){
    let otpCode=  crypto.randomInt(1000, 9999).toString();
    const expiresIn = Date.now() + 5 * 60 * 1000;
    return {otpCode, expiresIn}
}
