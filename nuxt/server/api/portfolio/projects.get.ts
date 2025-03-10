import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const projects = await prisma.project.findMany();
    return { projects };
  } catch (error) {
    return { error: "Failed to fetch projects" };
  }
});
