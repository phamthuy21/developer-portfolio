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
import { createTestUser, createTestMessage } from '../fixtures';
import { getAuthHeaders } from '../utils/auth.helper';
import * as bcrypt from 'bcrypt';

describe('MessagesController (e2e)', () => {
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
    await createTestMessage(prisma, {
      name: 'Alice',
      email: 'alice@test.com',
      subject: 'Hello',
      content: 'Hi',
    });
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await app.close();
  });

  describe('Public API', () => {
    it('/api/v1/messages (POST) - Creates a new message', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/messages')
        .send({
          name: 'Bob',
          email: 'bob@test.com',
          subject: 'Question',
          content: 'How do you do?',
        })
        .expect(201);
      expect(response.body.name).toBe('Bob');
    });
  });

  describe('Admin API', () => {
    it('/api/v1/admin/messages (GET) - Requires Auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/messages')
        .expect(401);
    });

    it('/api/v1/admin/messages (GET) - Returns messages', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/messages')
        .set(getAuthHeaders())
        .expect(200);
      expect(response.body.data.length).toBe(1);
    });

    it('/api/v1/admin/messages/unread-count (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/messages/unread-count')
        .set(getAuthHeaders())
        .expect(200);
      expect(response.body.count).toBe(1);
    });
  });
});
