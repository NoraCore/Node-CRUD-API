import dotenv from 'dotenv';

dotenv.config();

export const conf = {
  port: Number(process.env.PORT),
}