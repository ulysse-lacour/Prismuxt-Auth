import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to update a specific project content block
 * PUT /api/project/[id]/block/update
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
