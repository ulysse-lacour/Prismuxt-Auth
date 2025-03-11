import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const slug = query.slug as string;

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: "Portfolio slug is required",
    });
  }

  try {
    // First, get the portfolio ID from the slug
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!portfolio) {
      throw createError({
        statusCode: 404,
        message: "Portfolio not found",
      });
    }

    const portfolioId = portfolio.id;

    // Then fetch all projects and check if they're linked to this portfolio
    const projects = await prisma.project.findMany({
      include: {
        portfolioProjects: {
          where: {
            portfolioId,
          },
        },
      },
    });

    const projectsWithLinkStatus = projects.map((project) => ({
      ...project,
      isLinked: project.portfolioProjects.length > 0,
    }));

    return projectsWithLinkStatus;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch projects",
    });
  }
});
