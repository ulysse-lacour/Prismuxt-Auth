import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Updates the current user's email address and resets email verification status
 *
 * @endpoint PUT /api/account/update-email
 *
 * @auth Required
 *
 * @body {
 *   email: string - New email address to set for the user
 * }
 *
 * @response {
 *   success: boolean - Whether the email was updated successfully
 *   message: string - Success or error message
 * }
 *
 * @error {
 *   400: Bad Request - Invalid email format or email already in use
 *   401: Unauthorized - User not authenticated
 *   500: Internal Server Error - Server-side error
 * }
 *
 * @sideEffect Sets emailVerified to false when email is changed
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
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update email",
      cause: error,
    });
  }
});
