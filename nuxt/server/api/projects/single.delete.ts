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
    const { id } = body;

    // Update project data
    const deletedProject = await prisma.project.delete({
      where: { id },
    });

    return {
      success: true,
      project: deletedProject,
    };
  } catch (error) {
    console.error("Error deleting project:", error);
    throw createError({
      statusCode: 500,
      message: "Error deleting project",
    });
  }
});
