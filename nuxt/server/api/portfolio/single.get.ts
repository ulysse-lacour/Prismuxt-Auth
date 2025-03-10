import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { slug } = getQuery(event);
  const portfolioId = Array.isArray(slug) ? slug[0] : slug;

  if (!portfolioId) {
    throw createError({
      statusCode: 400,
      message: "Portfolio ID is required",
    });
  }

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug: portfolioId },
      include: {
        projects: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!portfolio) {
      throw createError({
        statusCode: 404,
        message: "Portfolio not found",
      });
    }

    return { portfolio };
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching portfolio",
    });
  }
});
