import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to update the current user's password
 * PUT /api/account/update-password
 *
 * Request body:
 * {
 *   currentPassword: string;
 *   newPassword: string;
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
    const { currentPassword, newPassword } = body;

    // Validate password inputs
    if (!currentPassword || typeof currentPassword !== "string") {
      throw createError({
        statusCode: 400,
        message: "Current password is required",
      });
    }

    if (!newPassword || typeof newPassword !== "string") {
      throw createError({
        statusCode: 400,
        message: "New password is required",
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      throw createError({
        statusCode: 400,
        message: "New password must be at least 8 characters long",
      });
    }

    // Fetch password hash from Account model
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "credential",
      },
      select: {
        password: true,
      },
    });

    if (!account || !account.password) {
      throw createError({
        statusCode: 404,
        message: "Password not found",
      });
    }

    // Get Better Auth context
    const ctx = await auth.$context;

    // Verify current password
    const isPasswordValid = await ctx.password.verify({
      password: currentPassword,
      hash: account.password,
    });

    if (!isPasswordValid) {
      throw createError({
        statusCode: 403,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await ctx.password.hash(newPassword);

    // Update user's password using internal adapter
    await ctx.internalAdapter.updatePassword(session.user.id, hashedPassword);

    // Return success response
    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error: any) {
    // Log error and return appropriate error response
    console.error("Error updating password:", error);

    // Return the error if it's already a handled error
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Error updating password",
    });
  }
});
