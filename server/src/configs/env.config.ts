import * as dotenv from 'dotenv';
import { join } from 'path';

// Load .env file
dotenv.config({ path: join(__dirname, "../../.env") });

export const env = {
  APP: {
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
  DATABASE: {
    HOST: process.env.DATABASE_HOST || 'localhost',
    PORT: parseInt(process.env.DATABASE_PORT || '3306', 10),
    USER: process.env.DATABASE_USER || 'root',
    PASSWORD: process.env.DATABASE_PASSWORD || 'secret',
    NAME: process.env.DATABASE_NAME || 'database',
  },
  API_KEYS: {
    GEMINI: process.env.GEMINI_API_KEY || '',
  },

  RABBITMQ: {
    NAME: process.env.NAME|| 'rabbitmq',
    URL: process.env.URL || 'amqp://localhost:5672',
    QUEUE: process.env.QUEUE || 'queue',
  }

};
