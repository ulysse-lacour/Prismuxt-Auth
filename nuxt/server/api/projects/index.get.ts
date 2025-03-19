import prisma from "~/utils/prisma";

/**
 * API endpoint to fetch all projects with their link status to a specific portfolio
 *
 * Endpoint: GET /api/projects?slug=<portfolioSlug>
 *
 * Query Parameters:
 * - slug: string - The unique slug of the portfolio to check project links against
 *
 * Response:
 * Array of Project objects with an additional isLinked property:
 * [
 *   {
 *     id: string;
 *     name: string;
 *     description: string;
 *     // ... other project properties
 *     isLinked: boolean; // Whether this project is linked to the specified portfolio
 *   },
 *   // ... more projects
 * ]
 *
 * Purpose: Used for portfolio management to show which projects are already
 * associated with a specific portfolio
 */

export default defineEventHandler(async (event) => {
  try {
    // Extract portfolio slug from query parameters
    const query = getQuery(event);
    const slug = query.slug as string;

    // Validate portfolio slug is provided
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

    // Return 404 if portfolio not found in database
    if (!portfolio) {
      throw createError({
        statusCode: 404,
        message: "Portfolio not found",
      });
    }

    const portfolioId = portfolio.id;

    // Fetch all projects and check if they're linked to this portfolio
    // by including the portfolioProjects relation filtered by portfolioId
    const projects = await prisma.project.findMany({
      include: {
        portfolioProjects: {
          where: {
            portfolioId,
          },
        },
      },
    });

    // Transform projects to include link status based on portfolioProjects relation
    const projectsWithLinkStatus = projects.map((project) => ({
      ...project,
      isLinked: project.portfolioProjects.length > 0,
    }));

    // Return projects with link status to client
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
