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
import { createTestUser, createTestCertificate } from '../fixtures';
import { getAuthHeaders } from '../utils/auth.helper';
import * as bcrypt from 'bcrypt';

describe('CertificatesController (e2e)', () => {
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
    await createTestCertificate(prisma, {
      name: 'AWS Certified',
      issuer: 'AWS',
    });
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await app.close();
  });

  describe('Public API', () => {
    it('/api/v1/certificates (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/certificates')
        .expect(200);
      expect(response.body.length).toBe(1);
    });
  });

  describe('Admin API', () => {
    it('/api/v1/admin/certificates (POST) - Creates certificate', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/certificates')
        .set(getAuthHeaders())
        .send({
          name: 'GCP Certified',
          issuer: 'Google',
          issueDate: new Date().toISOString(),
        })
        .expect(201);
      expect(response.body.name).toBe('GCP Certified');
    });
  });
});
