import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Fetches a single project by ID with all its content blocks and languages
 * for use in the project editor
 *
 * @endpoint GET /api/projects/single/:id/editor
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
 *     projectContents: Array<{
 *       id: string - Content unique identifier
 *       contentBlocks: Array<{
 *         id: string - Block unique identifier
 *         type: string - Block type
 *         order: number - Display order
 *         config: object - Block configuration
 *         content: object - Block content
 *         slideTag: {
 *           id: string - Tag unique identifier
 *           name: string - Tag name
 *           // ... other tag properties
 *         } | null - Associated slide tag
 *       }> - Ordered content blocks
 *       language: {
 *         id: string - Language unique identifier
 *         name: string - Language name
 *         code: string - Language code
 *         // ... other language properties
 *       } - Associated language
 *     }> - Project contents by language
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
