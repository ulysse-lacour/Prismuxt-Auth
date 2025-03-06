import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  const projectId = Array.isArray(id) ? id[0] : id;

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: "Project ID is required",
    });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw createError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    return { project };
  } catch (error) {
    console.error("Error fetching project:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching project",
    });
  }
});
