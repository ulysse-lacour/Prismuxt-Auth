import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to fetch tags for a specific project
 * GET /api/projects/:id/tags
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

    // Fetch tags for the project
    const projectTags = await prisma.projectTag.findMany({
      where: {
        projectId,
      },
      include: {
        tag: true,
      },
    });

    // Extract tag data from project tags
    const tags = projectTags.map((pt) => pt.tag);

    // Return tags
    return { tags };
  } catch (error) {
    // Log error and return appropriate error response
    console.error("Error fetching project tags:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching project tags",
    });
  }
});
