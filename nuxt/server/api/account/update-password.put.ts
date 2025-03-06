import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Get user session
  const session = await auth.api.getSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const body = await readBody(event);
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      message: "Current and new passwords are required",
    });
  }

  try {
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

    return { message: "Password updated successfully" };
  } catch (error) {
    console.error("Error updating password:", error);
    throw createError({
      statusCode: 500,
      message: "Error updating password",
    });
  }
});
