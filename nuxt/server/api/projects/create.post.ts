import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const session = await auth.api.getSession(event);

    if (!session) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const body = await readBody(event);
    const { name, description, client } = body;

    // Update project data
    const createdProject = await prisma.project.create({
      data: {
        name,
        description,
        client,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return {
      success: true,
      project: createdProject,
    };
  } catch (error) {
    console.error("Error updating project:", error);
    throw createError({
      statusCode: 500,
      message: "Error updating project",
    });
  }
});
