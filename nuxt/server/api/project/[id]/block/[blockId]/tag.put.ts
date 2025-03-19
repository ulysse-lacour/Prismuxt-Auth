import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Get the user session
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
  } catch (error) {
    console.error("Error updating slide tag:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update slide tag",
    });
  }
});
