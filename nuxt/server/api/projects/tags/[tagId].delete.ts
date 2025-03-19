import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Deletes a project tag for the authenticated user
 *
 * @endpoint DELETE /api/projects/tags/:tagId
 *
 * @auth Required
 *
 * @params {
 *   tagId: string - The unique identifier of the tag to delete
 * }
 *
 * @response {
 *   success: boolean - Whether the tag was deleted successfully
 *   message: string - Success message
 * }
 *
 * @error {
 *   400: Bad Request - Missing tag ID
 *   401: Unauthorized - User not authenticated
 *   404: Not Found - User not found
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Deletes the tag record from the database
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
