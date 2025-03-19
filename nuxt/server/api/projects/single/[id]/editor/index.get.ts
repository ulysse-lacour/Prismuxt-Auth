import prisma from "~/utils/prisma";

/**
 * API endpoint to fetch a single project by ID
 * GET /api/project/<id>/editor
 */

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
        projectContents: {
          include: {
            contentBlocks: {
              orderBy: {
                order: "asc",
              },
              include: {
                slideTag: true,
              },
            },
            language: true,
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

    // Return project data
    return { project };
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
