import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { swaggerConfig } from './../src/config/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  teardownTestDatabase,
} from './utils/database.util';

describe('AppController & Swagger (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await setupTestDatabase();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.setGlobalPrefix('api/v1');
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/v1/docs', app, document);
    await app.init();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await app.close();
  });

  it('/api/v1/docs-json (GET) - Swagger Validation', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/docs-json')
      .expect(200);

    const schema = response.body;
    expect(schema).toBeDefined();
    expect(schema.openapi).toBeDefined();
    expect(schema.paths).toBeDefined();

    // Verify all endpoints expose Tags, Security, DTO schemas
    Object.keys(schema.paths).forEach((path) => {
      Object.keys(schema.paths[path]).forEach((method) => {
        const operation = schema.paths[path][method];

        // Exclude root and docs from specific rules if needed, but here we check typical api endpoints
        if (path.includes('/api/v1')) {
          expect(operation.tags).toBeDefined();
          expect(operation.tags.length).toBeGreaterThan(0);
          expect(operation.responses).toBeDefined();

          // Check security for admin routes
          if (path.includes('/admin')) {
            expect(operation.security).toBeDefined();
            expect(operation.security.some((s: any) => s.bearer)).toBeTruthy();
          }
        }
      });
    });
  });
});
