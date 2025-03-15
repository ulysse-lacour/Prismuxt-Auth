import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to update the current user's name
 *
 * Endpoint: PUT /api/account/update-name
 *
 * Request body:
 * {
 *   name: string; // New full name for the user
 * }
 *
 * Response:
 * {
 *   success: boolean;
 *   message: string;
 * }
 *
 * Authentication: Required (user must be logged in)
 * Validation: Ensures name is non-empty and properly trimmed
 */

export default defineEventHandler(async (event) => {
  try {
    // Get user session from auth provider
    const session = await auth.api.getSession(event);

    // Verify user is authenticated
    if (!session) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized - User must be logged in",
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
    console.error("Error updating name:", error);

    // Return the error if it's already a properly formatted error
    if (error.statusCode) {
      throw error;
    }

    // Create a generic error for unexpected issues
    throw createError({
      statusCode: 500,
      message: "Error updating name",
    });
  }
});
