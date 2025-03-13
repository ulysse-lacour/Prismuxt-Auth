import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to add a tag to a project
 * POST /api/projects/:id/tags
 *
 * Request body:
 * {
 *   tagId: string;
 * }
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

    // Validate tag ID
    if (!tagId) {
      throw createError({
        statusCode: 400,
        message: "Tag ID is required",
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

    // Check if tag exists and belongs to the user
    const tag = await prisma.tag.findFirst({
      where: {
        id: tagId,
        userId: user.id,
      },
    });

    if (!tag) {
      throw createError({
        statusCode: 404,
        message: "Tag not found or access denied",
      });
    }

    // Check if the tag is already assigned to the project
    const existingProjectTag = await prisma.projectTag.findFirst({
      where: {
        projectId,
        tagId,
      },
    });

    if (existingProjectTag) {
      return {
        success: true,
        projectTag: existingProjectTag,
        message: "Tag already assigned to project",
      };
    }

    // Create project tag
    const projectTag = await prisma.projectTag.create({
      data: {
        projectId,
        tagId,
      },
    });

    // Return success response
    return {
      success: true,
      projectTag,
    };
  } catch (error: any) {
    // Handle specific Prisma errors
    if (error.code === "P2002") {
      throw createError({
        statusCode: 409,
        message: "Tag already assigned to project",
      });
    }

    // Log error and return appropriate error response
    console.error("Error adding tag to project:", error);
    throw createError({
      statusCode: 500,
      message: "Error adding tag to project",
    });
  }
});
