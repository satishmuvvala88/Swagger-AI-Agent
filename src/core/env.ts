import dotenv from 'dotenv';
import path from 'path';

const nodeEnv = process.env.NODE_ENV || 'development';

// Load environment-specific file first, then default .env
dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`) });
dotenv.config();

const env = {
  NODE_ENV: nodeEnv,
  PORT: process.env.PORT || '3000',
};

export default env;
