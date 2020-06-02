import * as dotenv from 'dotenv';

dotenv.config();

let path;

switch (process.env.NODE_ENV) {
  case 'development':
    path = `${__dirname}/../../.env.development`;
    break;
  case 'test':
    path = `${__dirname}/../../.env.test`;
    break;
  default:
    path = `${__dirname}/../../.env`;
    break;
}

dotenv.config({ path });
