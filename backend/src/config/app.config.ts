import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((url) => url.trim())
    : [frontendUrl];

  return {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT as string, 10) || 3000,
    globalPrefix: 'api/v1',
    frontendUrl,
    corsOrigins,
  };
});
