import { auth } from "@/utils/auth";
import prisma from "~/utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Get the user session
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
  } catch (error) {
    console.error("Error fetching slide tags:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch slide tags",
    });
  }
});
