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

  try {
    const body = await readBody(event);
    const { name } = body;

    if (!name) {
      throw createError({
        statusCode: 400,
        message: "Name is required",
      });
    }

    // Update user's name
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
      },
    });

    return {
      success: true,
      message: "Name updated successfully",
    };
  } catch (error) {
    console.error("Error updating name:", error);
    throw createError({
      statusCode: 500,
      message: "Error updating name",
    });
  }
});
