import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Updates the current user's display name
 *
 * @endpoint PUT /api/account/update-name
 *
 * @auth Required
 *
 * @body {
 *   name: string - New display name for the user (will be trimmed)
 * }
 *
 * @response {
 *   success: boolean - Whether the name was updated successfully
 *   message: string - Success or error message
 * }
 *
 * @error {
 *   400: Bad Request - Invalid or empty name
 *   401: Unauthorized - User not authenticated
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @validation Ensures name is non-empty and properly trimmed
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

    // Parse and extract name from request body
    const body = await readBody(event);
    const { name } = body;

    // Validate name is provided and properly formatted
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw createError({
        statusCode: 400,
        message: "Valid name is required",
      });
    }

    // Update user's name in database (with whitespace trimmed)
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: name.trim(),
      },
    });

    // Return success response to client
    return {
      success: true,
      message: "Name updated successfully",
    };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update name",
      cause: error,
    });
  }
});
