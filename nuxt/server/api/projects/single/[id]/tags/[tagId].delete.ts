import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to remove a tag from a project
 * DELETE /api/projects/:id/tags/:tagId
 */

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession(event);
    if (!session?.user?.email) {
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
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to remove tag from project",
      cause: error,
    });
  }
});
