import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to remove a tag from a project
 * DELETE /api/projects/:id/tags/:tagId
 */

// Initialize Prisma client
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Verify user authentication
    const session = await auth.api.getSession(event);

    // Check if user is authenticated
    if (!session || !session.user || !session.user.email) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Get project ID and tag ID from route params
    const projectId = event.context.params?.id;
    const tagId = event.context.params?.tagId;

    if (!projectId || !tagId) {
      throw createError({
        statusCode: 400,
        message: "Project ID and Tag ID are required",
      });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Check if user exists
    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Check if project exists and belongs to the user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      throw createError({
        statusCode: 404,
        message: "Project not found or access denied",
      });
    }

    // Delete the project tag
    await prisma.projectTag.deleteMany({
      where: {
        projectId,
        tagId,
      },
    });

    // Return success response
    return {
      success: true,
      message: "Tag removed from project",
    };
  } catch (error) {
    // Log error and return appropriate error response
    console.error("Error removing tag from project:", error);
    throw createError({
      statusCode: 500,
      message: "Error removing tag from project",
    });
  }
});
