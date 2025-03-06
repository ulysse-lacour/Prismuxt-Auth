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
    // Fetch user's projects and portfolios
    const [projects, portfolios] = await Promise.all([
      prisma.project.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.portfolio.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    // Return structured navigation data
    return {
      projects: projects.map((project) => ({
        title: project.name,
        url: `/projects/${project.id}`,
      })),
      portfolios: portfolios.map((portfolio) => ({
        title: portfolio.name,
        url: `/portfolios/${portfolio.slug}`,
      })),
    };
  } catch (error) {
    console.error("Error fetching navigation data:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching navigation data",
    });
  }
});
