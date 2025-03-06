import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CustomError extends Error {
  statusCode?: number;
}

export default defineEventHandler(async (event) => {
  // Get user session
  const session = await auth.api.getSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  try {
    const body = await readBody(event);
    const { email } = body;

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
        NOT: {
          id: session.user.id,
        },
      },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Email already in use",
      });
    }

    // Update user's email
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        email,
      },
    });

    return {
      success: true,
      message: "Email updated successfully",
    };
  } catch (error) {
    console.error("Error updating email:", error);
    const customError = error as CustomError;
    if (customError.statusCode === 400) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "Error updating email",
    });
  }
});
