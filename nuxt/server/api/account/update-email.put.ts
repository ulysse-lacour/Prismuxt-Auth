import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to update the current user's email address
 *
 * Endpoint: PUT /api/account/update-email
 *
 * Request body:
 * {
 *   email: string; // New email address
 * }
 *
 * Response:
 * {
 *   success: boolean;
 *   message: string;
 * }
 *
 * Authentication: Required (user must be logged in)
 * Side effects: Sets emailVerified to false when email is changed
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

    // Parse and extract email from request body
    const body = await readBody(event);
    const { email } = body;

    // Validate email format
    if (!email || typeof email !== "string" || !email.includes("@")) {
      throw createError({
        statusCode: 400,
        message: "Valid email is required",
      });
    }

    // Check if email is already in use by another user
    // This prevents email conflicts across different accounts
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: {
          not: session.user.id,
        },
      },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Email already in use by another account",
      });
    }

    // Update user's email in database and reset verification status
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        email,
        // Reset email verification status when email is changed
        // User will need to verify the new email address
        emailVerified: false,
      },
    });

    // Return success response to client
    return {
      success: true,
      message: "Email updated successfully",
    };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error("Error updating email:", error);

    // Return the error if it's already a properly formatted error
    if (error.statusCode) {
      throw error;
    }

    // Create a generic error for unexpected issues
    throw createError({
      statusCode: 500,
      message: "Error updating email",
    });
  }
});
