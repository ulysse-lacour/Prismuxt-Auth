import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Updates the slide tag of a project content block
 *
 * @endpoint PUT /api/projects/single/:id/block/:blockId/slide-tag
 *
 * @auth Required
 *
 * @params {
 *   id: string - The unique identifier of the project
 *   blockId: string - The unique identifier of the content block
 * }
 *
 * @body {
 *   tagId: string | null - The ID of the tag to assign, or null to remove the tag
 * }
 *
 * @response {
 *   block: {
 *     id: string - Block unique identifier
 *     slideTagId: string | null - Associated slide tag ID
 *     slideTag: {
 *       id: string - Tag unique identifier
 *       name: string - Tag name
 *       userId: string - Owner's user ID
 *       // ... other tag properties
 *     } | null - Associated slide tag data
 *     // ... other block properties
 *   }
 * }
 *
 * @error {
 *   400: Bad Request - Missing project ID or block ID
 *   401: Unauthorized - User not authenticated
 *   404: Not Found - Project, user, or tag not found
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Updates the slideTagId field of the content block
 */

export default defineEventHandler(async (event) => {
  try {
    // Check if user is authenticated
    const session = await auth.api.getSession(event);
    if (!session?.user?.email) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Get URL parameters
    const projectId = getRouterParam(event, "id");
    const blockId = getRouterParam(event, "blockId");

    if (!projectId || !blockId) {
      throw createError({
        statusCode: 400,
        message: "Project ID and block ID are required",
      });
    }

    // Get request body
    const body = await readBody(event);
    const { tagId } = body;

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Verify project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      throw createError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    // If tagId is provided, verify it exists and belongs to user
    if (tagId) {
      const tag = await prisma.slideTag.findFirst({
        where: {
          id: tagId,
          userId: user.id,
        },
      });

      if (!tag) {
        throw createError({
          statusCode: 404,
          message: "Tag not found",
        });
      }
    }

    // Update the block with the new tag
    const block = await prisma.projectContentBlock.update({
      where: {
        id: blockId,
      },
      data: {
        slideTagId: tagId, // If tagId is null, this will remove the tag
      },
      include: {
        slideTag: true, // Include the slideTag relation in the response
      },
    });

    return { block };
  } catch (error: any) {
    console.error(error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update slide tag",
      cause: error,
    });
  }
});
