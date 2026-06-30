import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

export const setupTestDatabase = async () => {
  // Push schema to the test database
  console.log('Running test database schema push...');
  execSync(
    'npx --yes dotenv-cli -e .env.test -- npx prisma db push --accept-data-loss',
    { stdio: 'inherit' },
  );
};

export const cleanupTestDatabase = async () => {
  // Truncate application tables using CASCADE to wipe data but keep structure
  const tableNames = [
    'users',
    'projects',
    'blogs',
    'skills',
    'experiences',
    'certificates',
    'messages',
    'project_skills',
    'experience_skills',
  ];

  for (const tableName of tableNames) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE;`);
    } catch (e) {
      console.error(`Error truncating table ${tableName}:`, e);
    }
  }
};

export const teardownTestDatabase = async () => {
  await prisma.$disconnect();
};

export const getTestPrismaClient = () => prisma;
