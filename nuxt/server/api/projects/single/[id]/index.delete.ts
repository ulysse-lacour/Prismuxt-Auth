import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Deletes a project and all its associated data
 *
 * @endpoint DELETE /api/projects/single/:id
 *
 * @auth Required
 *
 * @params {
 *   id: string - The unique identifier of the project to delete
 * }
 *
 * @response {
 *   success: boolean - Whether the deletion was successful
 *   project: {
 *     id: string - Project unique identifier
 *     name: string - Project name
 *     description: string | null - Project description
 *     client: string | null - Client name
 *     // ... other project properties
 *   }
 * }
 *
 * @error {
 *   400: Bad Request - Missing project ID
 *   401: Unauthorized - User not authenticated
 *   404: Not Found - Project not found
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Deletes the project and all related records from the database
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
