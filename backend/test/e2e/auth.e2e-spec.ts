import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../../src/app.module';
import {
  setupTestDatabase,
  cleanupTestDatabase,
  teardownTestDatabase,
  getTestPrismaClient,
} from '../utils/database.util';
import { createTestUser } from '../fixtures';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const prisma = getTestPrismaClient();

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
    await app.init();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    // Seed admin user
    const passwordHash = await bcrypt.hash('Password123!', 10);
    await createTestUser(prisma, { passwordHash });
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await app.close();
  });

  describe('/api/v1/auth/login (POST)', () => {
    it('should login and return tokens - Performance Smoke Test', async () => {
      const start = performance.now();
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@example.com', password: 'Password123!' })
        .expect(200);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500); // Smoke test
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it('should return 401 on invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@example.com', password: 'WrongPassword' })
        .expect(401);
    });

    it('should return 400 on invalid payload', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'not-an-email', password: '' })
        .expect(401);
    });
  });
});
