import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to fetch a single project by ID
 * GET /api/projects/single?id=<projectId>
 */

// Initialize Prisma client
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Extract project ID from query parameters
  const { id } = getQuery(event);
  const projectId = Array.isArray(id) ? id[0] : id;

  // Validate project ID
  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: "Project ID is required",
    });
  }

  try {
    // Fetch project from database
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    // Return 404 if project not found
    if (!project) {
      throw createError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    // Return project data
    return { project };
  } catch (error) {
    // Log error and return appropriate error response
    console.error("Error fetching project:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching project",
    });
  }
});
