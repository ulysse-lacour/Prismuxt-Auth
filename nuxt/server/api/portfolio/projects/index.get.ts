import { PrismaClient } from "@prisma/client";

/**
 * API endpoint to fetch all projects with their link status to a specific portfolio
 * GET /api/portfolio/projects?slug=<portfolioSlug>
 *
 * Returns all projects with a flag indicating if they are linked to the specified portfolio
 */

// Initialize Prisma client
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Extract portfolio slug from query parameters
    const query = getQuery(event);
    const slug = query.slug as string;

    // Validate portfolio slug
    if (!slug) {
      throw createError({
        statusCode: 400,
        message: "Portfolio slug is required",
      });
    }

    // First, get the portfolio ID from the slug
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      select: { id: true },
    });

    // Return 404 if portfolio not found
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

    // Map projects to include link status
    const projectsWithLinkStatus = projects.map((project) => ({
      ...project,
      isLinked: project.portfolioProjects.length > 0,
    }));

    // Return projects with link status
    return projectsWithLinkStatus;
  } catch (error: any) {
    // Log error and return appropriate error response
    console.error("Error fetching projects:", error);

    // Return the error if it's already a handled error
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Failed to fetch projects",
    });
  }
});
