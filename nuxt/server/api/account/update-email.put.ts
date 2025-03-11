import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to update the current user's email
 * PUT /api/account/update-email
 *
 * Request body:
 * {
 *   email: string;
 * }
 *
 * Requires authentication
 */

// Initialize Prisma client
const prisma = new PrismaClient();

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
    const { email } = body;

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      throw createError({
        statusCode: 400,
        message: "Valid email is required",
      });
    }

    // Check if email is already in use by another user
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

    // Update user's email in database
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        email,
        // Reset email verification status when email is changed
        emailVerified: false,
      },
    });

    // Return success response
    return {
      success: true,
      message: "Email updated successfully",
    };
  } catch (error: any) {
    // Log error and return appropriate error response
    console.error("Error updating email:", error);

    // Return the error if it's already a handled error
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Error updating email",
    });
  }
});
