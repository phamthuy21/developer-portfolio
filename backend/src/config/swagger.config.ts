import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Portfolio API')
  .setDescription('The IT Developer Portfolio API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
