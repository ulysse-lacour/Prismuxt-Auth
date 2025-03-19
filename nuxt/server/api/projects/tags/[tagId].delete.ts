import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to remove a tag from a user
 * DELETE /api/projects/tags/:tagId
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
    // Get tag ID from route params
    const tagId = event.context.params?.tagId;

    if (!tagId) {
      throw createError({
        statusCode: 400,
        message: "Tag ID are required",
      });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Check if user exists
    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Delete the project tag
    await prisma.tag.deleteMany({
      where: {
        id: tagId,
        userId: user.id,
      },
    });

    // Return success response
    return {
      success: true,
      message: "Tag removed",
    };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to remove tag",
      cause: error,
    });
  }
});
