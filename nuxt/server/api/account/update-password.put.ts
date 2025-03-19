import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

/**
 * API endpoint to update the current user's password
 *
 * Endpoint: PUT /api/account/update-password
 *
 * Request body:
 * {
 *   currentPassword: string; // User's current password for verification
 *   newPassword: string;     // New password to set
 * }
 *
 * Response:
 * {
 *   success: boolean;
 *   message: string;
 * }
 *
 * Authentication: Required (user must be logged in)
 * Security: Verifies current password before allowing change
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

    // Parse and extract password data from request body
    const body = await readBody(event);
    const { currentPassword, newPassword } = body;

    // Validate current password is provided
    if (!currentPassword || typeof currentPassword !== "string") {
      throw createError({
        statusCode: 400,
        message: "Current password is required",
      });
    }

    // Validate new password is provided
    if (!newPassword || typeof newPassword !== "string") {
      throw createError({
        statusCode: 400,
        message: "New password is required",
      });
    }

    // Validate new password meets minimum security requirements
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
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update password",
      cause: error,
    });
  }
});
