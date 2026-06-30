import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../../src/app.module';
import { setupTestDatabase, cleanupTestDatabase, teardownTestDatabase, getTestPrismaClient } from '../utils/database.util';
import { createTestUser, createTestSkill } from '../fixtures';
import { getAuthHeaders } from '../utils/auth.helper';
import * as bcrypt from 'bcrypt';

describe('SkillsController (e2e)', () => {
  let app: INestApplication;
  const prisma = getTestPrismaClient();

  beforeAll(async () => {
    await setupTestDatabase();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    // Seed admin user
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const admin = await createTestUser(prisma, { passwordHash });

    // Seed some skills
    await createTestSkill(prisma, { name: 'React', slug: 'react', category: 'Frontend' });
    await createTestSkill(prisma, { name: 'Node.js', slug: 'nodejs', category: 'Backend' });
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await app.close();
  });

  describe('Public API', () => {
    it('/api/v1/skills (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/skills')
        .expect(200);
      
      expect(Object.keys(response.body).length).toBe(2);
      expect(response.body.Backend.length).toBe(1);
      expect(response.body.Frontend.length).toBe(1);
    });
  });

  describe('Admin API', () => {
    it('/api/v1/admin/skills (GET) - Requires Auth', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/admin/skills')
        .expect(401);
    });

    it('/api/v1/admin/skills (GET) - Returns all skills', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/skills')
        .set(getAuthHeaders())
        .expect(200);

      expect(response.body.length).toBe(2);
    });

    it('/api/v1/admin/skills (POST) - Creates a skill', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/admin/skills')
        .set(getAuthHeaders())
        .send({
          name: 'PostgreSQL',
          slug: 'postgresql',
          category: 'Database'
        })
        .expect(201);

      expect(response.body.name).toBe('PostgreSQL');
    });
  });
});
