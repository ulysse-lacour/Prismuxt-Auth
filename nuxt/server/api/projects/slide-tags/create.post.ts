import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

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

    // Get the request body
    const body = await readBody(event);
    const { name } = body;

    if (!name) {
      throw createError({
        statusCode: 400,
        message: "Tag name is required",
      });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Create the new tag
    const tag = await prisma.slideTag.create({
      data: {
        name,
        userId: user.id,
      },
    });

    return { tag };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to create slide tag",
      cause: error,
    });
  }
});
