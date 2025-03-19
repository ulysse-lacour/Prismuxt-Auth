import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to delete a project
 * DELETE /api/project/<id>
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

    // Get project ID from route params
    const projectId = event.context.params?.id;

    // Validate project ID
    if (!projectId) {
      throw createError({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    // Delete project from database
    const deletedProject = await prisma.project.delete({
      where: { id: projectId },
    });

    // Return success response with deleted project data
    return {
      success: true,
      project: deletedProject,
    };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to delete project",
      cause: error,
    });
  }
});
