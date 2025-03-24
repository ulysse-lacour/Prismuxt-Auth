import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Fetches a single project by ID, including its tags and content blocks
 *
 * @endpoint GET /api/projects/single/:id
 *
 * @auth Not Required
 *
 * @params {
 *   id: string - The unique identifier of the project to fetch
 * }
 *
 * @response {
 *   project: {
 *     id: string - Project unique identifier
 *     name: string - Project name
 *     description: string | null - Project description
 *     client: string | null - Client name
 *     tags: Array<{
 *       id: string - Tag unique identifier
 *       name: string - Tag name
 *       userId: string - Owner's user ID
 *       createdAt: string - Creation timestamp
 *       updatedAt: string - Last update timestamp
 *     }>
 *     projectContents: Array<{
 *       contentBlocks: Array<ContentBlock> - Project content blocks
 *       language: Language - Associated language
 *     }>
 *     // ... other project properties
 *   }
 * }
 *
 * @error {
 *   400: Bad Request - Missing project ID
 *   404: Not Found - Project not found
 *   500: Internal Server Error - Server-side error
 * }
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
        projectTags: {
          include: {
            tag: true,
          },
        },
        projectContents: {
          include: {
            contentBlocks: true,
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

    // Transform project data to include tags in a more accessible format
    const projectWithTags = {
      ...project,
      tags: project.projectTags.map((pt) => pt.tag),
    };

    // Return project data
    return { project: projectWithTags };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch project",
      cause: error,
    });
  }
});
