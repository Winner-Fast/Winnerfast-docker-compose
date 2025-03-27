import * as jwt from 'jsonwebtoken';

async function tokenGenerator(user: any, expiration: number){
  const payload = {
    id: user.id,
    firstName: user.firstName,
    lastName:user.lastName,
    role:user.role,
    email:user.email
  };

  const secretKey = `${process.env.TOKEN_SECRET}`;
//   console.log('secret Key:', process.env.TOKEN_SECRET);
  return jwt.sign(payload, secretKey, { expiresIn: `${expiration}h` });
}
export default tokenGenerator
