import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Removes a tag from a project
 *
 * @endpoint DELETE /api/projects/single/:id/tags/:tagId
 *
 * @auth Required
 *
 * @params {
 *   id: string - The unique identifier of the project
 *   tagId: string - The unique identifier of the tag to remove
 * }
 *
 * @response {
 *   success: boolean - Whether the tag was removed successfully
 *   message: string - Success message
 * }
 *
 * @error {
 *   400: Bad Request - Missing project ID or tag ID
 *   401: Unauthorized - User not authenticated
 *   404: Not Found - Project not found or access denied
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Removes the project-tag association from the database
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
