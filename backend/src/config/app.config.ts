import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT as string, 10) || 3000,
  globalPrefix: 'api/v1',
}));
