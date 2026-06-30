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
import { createTestUser, createTestExperience } from '../fixtures';
import { getAuthHeaders } from '../utils/auth.helper';
import * as bcrypt from 'bcrypt';

describe('ExperiencesController (e2e)', () => {
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
    const passwordHash = await bcrypt.hash('Password123!', 10);
    await createTestUser(prisma, { passwordHash });
    await createTestExperience(prisma, {
      company: 'Tech Corp',
      position: 'Developer',
    });
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await app.close();
  });

  describe('Public API', () => {
    it('/api/v1/experiences (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/experiences')
        .expect(200);
      expect(response.body.length).toBe(1);
    });
  });

  describe('Admin API', () => {
    it('/api/v1/admin/experiences (GET) - Requires Auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/experiences')
        .expect(401);
    });

    it('/api/v1/admin/experiences (POST) - Creates experience', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/experiences')
        .set(getAuthHeaders())
        .send({
          company: 'New Corp',
          position: 'Senior Developer',
          startDate: new Date().toISOString(),
          description: 'Desc',
        })
        .expect(201);
      expect(response.body.company).toBe('New Corp');
    });
  });
});
