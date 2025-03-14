import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to fetch a single project by ID
 * GET /api/project/<id>
 */

// Initialize Prisma client
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Get project ID from route params
  const projectId = event.context.params?.id;

  // Validate project ID
  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: "Project ID is required",
    });
  }

  try {
    // Fetch project from database with tags
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        projectTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Return 404 if project not found
    if (!project) {
      throw createError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    // Transform project data to include tags in a more accessible format
    const projectWithTags = {
      ...project,
      tags: project.projectTags.map((pt) => pt.tag),
    };

    // Return project data
    return { project: projectWithTags };
  } catch (error) {
    // Log error and return appropriate error response
    console.error("Error fetching project:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching project",
    });
  }
});
