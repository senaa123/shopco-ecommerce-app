import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Database seed script.
 *
 * Placeholder — seed data (categories, products, an admin user, etc.) will be
 * added in a later prompt. Run with `npm run seed`.
 */
async function main(): Promise<void> {
  // TODO: implement seeding logic.
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
