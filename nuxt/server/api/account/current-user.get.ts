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
    // Fetch user's data
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        projects: true,
        portfolios: true,
        emailVerified: true,
        image: true,
        twoFactorEnabled: true,
      },
    });

    // Return user data
    return { user };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching user data",
    });
  }
});
