import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial reference data...');

  // 1. Seed Skills
  const skills = [
    {
      name: 'React',
      slug: 'react',
      category: 'Frontend',
    },
    {
      name: 'Next.js',
      slug: 'nextjs',
      category: 'Frontend',
    },
    {
      name: 'NestJS',
      slug: 'nestjs',
      category: 'Backend',
    },
    {
      name: 'TypeScript',
      slug: 'typescript',
      category: 'Language',
    },
    {
      name: 'PostgreSQL',
      slug: 'postgresql',
      category: 'Database',
    },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {},
      create: skill,
    });
  }
  console.log('Skills seeded.');

  // 2. Seed Certificates
  const certificates = [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: new Date('2025-01-01T00:00:00Z'),
    },
  ];

  for (const cert of certificates) {
    const existing = await prisma.certificate.findFirst({
      where: { name: cert.name },
    });
    if (!existing) {
      await prisma.certificate.create({ data: cert });
    }
  }
  console.log('Certificates seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
