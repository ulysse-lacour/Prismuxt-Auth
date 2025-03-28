import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Creates a new project content block with default configurations based on type
 *
 * @endpoint POST /api/projects/single/:id/block/create
 *
 * @auth Required
 *
 * @params {
 *   id: string - The unique identifier of the project
 * }
 *
 * @body {
 *   type: "HEADER" | "TEXT" | "IMAGE" | "QUOTE" - Type of content block (defaults to "TEXT")
 *   contentId: string - ID of the project content to add the block to
 *   order?: number - Display order (auto-calculated if not provided)
 *   config?: object - Additional configuration options
 *   content?: object - Additional content options
 * }
 *
 * @response {
 *   block: {
 *     id: string - Block unique identifier
 *     type: string - Block type
 *     order: number - Display order
 *     config: object - Block configuration
 *     content: object - Block content
 *     projectContentId: string - Associated project content ID
 *     createdAt: string - Creation timestamp
 *     updatedAt: string - Last update timestamp
 *   }
 * }
 *
 * @error {
 *   400: Bad Request - Missing project ID or content ID
 *   401: Unauthorized - User not authenticated
 *   404: Not Found - Project content not found
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Creates a new content block record in the database with default configurations
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
  const { type = "TEXT", contentId, order, config = {}, content = {} } = await readBody(event);

  // Validate required fields
  if (!contentId) {
    throw createError({
      statusCode: 400,
      message: "Content ID is required",
    });
  }

  try {
    // Check if the specified project content exists and belongs to the project
    const projectContent = await prisma.projectContent.findUnique({
      where: {
        id: contentId,
        projectId,
      },
      include: {
        contentBlocks: {
          orderBy: {
            order: "desc",
          },
          take: 1,
        },
      },
    });

    // Return 404 if project content not found
    if (!projectContent) {
      throw createError({
        statusCode: 404,
        message: "Project content not found or does not belong to the specified project",
      });
    }

    // Calculate the new order
    const newOrder =
      order ||
      (projectContent.contentBlocks.length > 0 ? projectContent.contentBlocks[0].order + 1 : 1);

    // Set default configurations based on block type
    let defaultConfig = {};
    let defaultContent = {};

    switch (type) {
      case "HEADER":
        defaultConfig = { align: "center", size: "large" };
        defaultContent = { text: "New Header" };
        break;
      case "TEXT":
        defaultConfig = { align: "left" };
        defaultContent = { text: "New text content" };
        break;
      case "IMAGE":
        defaultConfig = { width: "full", height: "auto" };
        defaultContent = { src: "", alt: "Image description" };
        break;
      case "QUOTE":
        defaultConfig = { style: "modern" };
        defaultContent = { text: "New quote text", author: "Author name" };
        break;
    }

    // Create the new content block
    const newBlock = await prisma.projectContentBlock.create({
      data: {
        type,
        order: newOrder,
        config: { ...defaultConfig, ...config },
        content: { ...defaultContent, ...content },
        projectContentId: contentId,
      },
    });

    // Return the newly created block
    return { block: newBlock };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create project content block",
      cause: error,
    });
  }
});
