import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, name, description, client } = body;

    // Update project data
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        client,
      },
    });

    return {
      success: true,
      project: updatedProject,
    };
  } catch (error) {
    console.error("Error updating project:", error);
    throw createError({
      statusCode: 500,
      message: "Error updating project",
    });
  }
});
