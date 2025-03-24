import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Updates a project's basic information (name, description, client)
 *
 * @endpoint PUT /api/projects/single/:id
 *
 * @auth Required
 *
 * @params {
 *   id: string - The unique identifier of the project to update
 * }
 *
 * @body {
 *   name?: string - New project name (optional)
 *   description?: string - New project description (optional)
 *   client?: string - New client name (optional)
 * }
 *
 * @response {
 *   success: boolean - Whether the update was successful
 *   project: {
 *     id: string - Project unique identifier
 *     name: string - Updated project name
 *     description: string | null - Updated project description
 *     client: string | null - Updated client name
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

    if (!projectId) {
      throw createError({
        statusCode: 400,
        message: "Project ID is required",
      });
    }

    // Parse request body
    const body = await readBody(event);
    const { name, description, client } = body;

    // Update project data in database
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(client !== undefined && { client }),
      },
    });

    // Return success response with updated project
    return {
      success: true,
      project: updatedProject,
    };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update project",
      cause: error,
    });
  }
});
