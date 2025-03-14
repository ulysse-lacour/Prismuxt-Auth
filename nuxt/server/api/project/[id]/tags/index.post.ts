import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint add a new tag to a project
 * POST /api/project/:id/tags
 *
 * Request body:
 * {
 *   tagId: string;
 * }
 */

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

    // Return success response
    return {
      success: true,
      addedTag,
    };
  } catch (error: any) {
    // Log error and return appropriate error response
    console.error("Error adding tags to project:", error);
    throw createError({
      statusCode: 500,
      message: "Error adding tags to project",
    });
  }
});
