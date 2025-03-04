import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
