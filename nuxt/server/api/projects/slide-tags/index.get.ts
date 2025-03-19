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

    // Get all slide tags for the user
    const tags = await prisma.slideTag.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
    });

    return { tags };
  } catch (error: any) {
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch slide tags",
      cause: error,
    });
  }
});
