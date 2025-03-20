import prisma from "~/utils/prisma";

/**
 * @server
 *
 * @description Fetches all projects with their link status to a specific portfolio.
 * Each project in the response includes an isLinked boolean indicating whether it's
 * currently linked to the specified portfolio.
 *
 * @endpoint GET /api/portfolios/single/projects
 *
 * @auth Not Required
 *
 * @query {
 *   slug: string - The unique slug of the portfolio to check project links against
 * }
 *
 * @response {
 *   projects: Array<{
 *     id: string - Project unique identifier
 *     name: string - Project name
 *     description: string - Project description
 *     isLinked: boolean - Whether this project is linked to the specified portfolio
 *     // ... other project properties
 *   }>
 * }
 *
 * @error {
 *   400: Bad Request - Portfolio slug is required
 *   404: Not Found - Portfolio not found
 *   500: Internal Server Error - Server-side error
 * }
 */

export default defineEventHandler(async (event) => {
  try {
    // Extract portfolio slug from query parameters
    const query = getQuery(event);
    const slug = query.slug as string;

    console.log("event query params:", query);
    console.log("portfolio slug:", slug);

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
    // Log error for server-side debugging
    console.error(error);

    // Throw error
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch projects",
      cause: error,
    });
  }
});
