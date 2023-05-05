// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const author1 = await prisma.authors.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Alice',
    },
  });

  const author2 = await prisma.authors.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Bob',
    },
  });

  const tag1 = await prisma.tags.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Tag1',
    },
  });

  const tag2 = await prisma.tags.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Tag2',
    },
  });

  console.log({ author1, author2, tag1, tag2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
