import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Adds a new tag to a project
 *
 * @endpoint POST /api/projects/single/:id/tags
 *
 * @auth Required
 *
 * @params {
 *   id: string - The unique identifier of the project
 * }
 *
 * @body {
 *   tagId: string - ID of the tag to add to the project
 * }
 *
 * @response {
 *   success: boolean - Whether the tag was added successfully
 *   addedTag: {
 *     id: string - Project tag unique identifier
 *     projectId: string - Associated project ID
 *     tagId: string - Associated tag ID
 *     createdAt: string - Creation timestamp
 *     updatedAt: string - Last update timestamp
 *   }
 * }
 *
 * @error {
 *   400: Bad Request - Missing project ID or tag ID
 *   401: Unauthorized - User not authenticated
 *   404: Not Found - Project not found or access denied
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Creates a new project-tag association in the database
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
    const { tagId } = body;

    // Check if project exists and belongs to the user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id,
      },
    });

    if (!project) {
      throw createError({
        statusCode: 404,
        message: "Project not found or access denied",
      });
    }

    // Add tag to project
    const addedTag = await prisma.projectTag.create({
      data: {
        projectId,
        tagId,
      },
    });

    // Update project's updatedAt timestamp
    await prisma.project.update({
      where: { id: projectId },
      data: {
        updatedAt: new Date(),
      },
    });

    // Return success response
    return {
      success: true,
      addedTag,
    };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch user data",
      cause: error,
    });
  }
});
