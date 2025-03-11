import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to delete a project
 * DELETE /api/projects/single
 *
 * Request body:
 * {
 *   id: string;
 * }
 */

// Initialize Prisma client
const prisma = new PrismaClient();

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

    // Parse request body
    const body = await readBody(event);
    const { id } = body;

    // Validate project ID
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    // Delete project from database
    const deletedProject = await prisma.project.delete({
      where: { id },
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
