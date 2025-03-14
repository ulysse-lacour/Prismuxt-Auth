import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to update the current user's name
 * PUT /api/account/update-name
 *
 * Request body:
 * {
 *   name: string;
 * }
 *
 * Requires authentication
 */

export default defineEventHandler(async (event) => {
  try {
    // Get user session
    const session = await auth.api.getSession(event);

    // Verify authentication
    if (!session) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    // Parse request body
    const body = await readBody(event);
    const { name } = body;

    // Validate name
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw createError({
        statusCode: 400,
        message: "Valid name is required",
      });
    }

    // Update user's name in database
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name.trim(),
      },
    });

    // Return success response
    return {
      success: true,
      message: "Name updated successfully",
    };
  } catch (error: any) {
    // Log error and return appropriate error response
    console.error("Error updating name:", error);

    // Return the error if it's already a handled error
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Error updating name",
    });
  }
});
