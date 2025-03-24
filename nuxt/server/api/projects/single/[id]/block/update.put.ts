import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Updates a specific project content block's type, configuration, and content
 *
 * @endpoint PUT /api/projects/single/:id/block/update
 *
 * @auth Required
 *
 * @params {
 *   id: string - The unique identifier of the project
 * }
 *
 * @body {
 *   blockId: string - ID of the content block to update
 *   type?: "HEADER" | "TEXT" | "IMAGE" | "QUOTE" - New block type
 *   config?: object - New configuration options
 *   content?: object - New content options
 * }
 *
 * @response {
 *   block: {
 *     id: string - Block unique identifier
 *     type: string - Updated block type
 *     config: object - Updated configuration
 *     content: object - Updated content
 *     projectContentId: string - Associated project content ID
 *     createdAt: string - Creation timestamp
 *     updatedAt: string - Last update timestamp
 *   }
 * }
 *
 * @error {
 *   400: Bad Request - Missing project ID or block ID
 *   401: Unauthorized - User not authenticated
 *   403: Forbidden - Block does not belong to the specified project
 *   404: Not Found - Content block not found
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Updates the specified content block in the database
 */

export default defineEventHandler(async (event) => {
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

  // Validate project ID
  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: "Project ID is required",
    });
  }

  // Get request body
  const { blockId, type, config, content } = await readBody(event);

  // Validate required fields
  if (!blockId) {
    throw createError({
      statusCode: 400,
      message: "Block ID is required",
    });
  }

  try {
    // Find the block first to check if it exists and belongs to the specified project
    const existingBlock = await prisma.projectContentBlock.findUnique({
      where: { id: blockId },
      include: {
        projectContent: true,
      },
    });

    // Return 404 if block not found
    if (!existingBlock) {
      throw createError({
        statusCode: 404,
        message: "Content block not found",
      });
    }

    // Verify that the block belongs to the specified project
    if (existingBlock.projectContent.projectId !== projectId) {
      throw createError({
        statusCode: 403,
        message: "Block does not belong to the specified project",
      });
    }

    // Prepare update data with only the provided fields
    const updateData: any = {};

    if (type) updateData.type = type;
    if (config) updateData.config = config;
    if (content) updateData.content = content;

    // Update the block in the database
    const updatedBlock = await prisma.projectContentBlock.update({
      where: { id: blockId },
      data: updateData,
    });

    // Update project's updatedAt timestamp
    await prisma.project.update({
      where: { id: projectId },
      data: {
        updatedAt: new Date(),
      },
    });

    // Return the updated block
    return { block: updatedBlock };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update project content block",
      cause: error,
    });
  }
});
