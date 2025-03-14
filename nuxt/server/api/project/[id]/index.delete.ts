import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to delete a project
 * DELETE /api/project/<id>
 */

export default defineEventHandler(async (event) => {
  try {
    // Verify user authentication
    const session = await auth.api.getSession(event);

    if (!session) {
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
    // Handle specific Prisma errors
    if (error.code === "P2025") {
      throw createError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    // Log error and return appropriate error response
    console.error("Error deleting project:", error);
    throw createError({
      statusCode: 500,
      message: "Error deleting project",
    });
  }
});
