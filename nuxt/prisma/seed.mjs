import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seeds the database with initial data.
 *
 * This asynchronous function is a placeholder intended to seed the database.
 * Currently, it logs a success message and should be updated with actual data insertion logic.
 */
async function seed() {
  //  TODO: Add seed data here

  console.log("Seed data created successfully");
}

try {
  await seed();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
