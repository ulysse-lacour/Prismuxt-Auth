import prisma from "~/utils/prisma";

/**
 * API endpoint to remove a project from a portfolio
 * PUT /api/portfolio/remove-project
 *
 * Request body:
 * {
 *   slug: string;        // Portfolio slug
 *   relatedProject: string;  // PortfolioProject ID to remove
 * }
 *
 * Returns the updated portfolio with remaining related projects
 */

export default defineEventHandler(async (event) => {
  try {
    // Parse request body
    const body = await readBody(event);
    const { slug, relatedProject } = body;

    // Validate required fields
    if (!slug || typeof slug !== "string") {
      throw createError({
        statusCode: 400,
        message: "Portfolio slug is required",
      });
    }

    if (!relatedProject || typeof relatedProject !== "string") {
      throw createError({
        statusCode: 400,
        message: "PortfolioProject ID is required",
      });
    }

    // Check if the portfolio exists
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

    // Check if the portfolio project relationship exists
    const portfolioProject = await prisma.portfolioProject.findUnique({
      where: {
        id: relatedProject,
      },
    });

    if (!portfolioProject) {
      throw createError({
        statusCode: 404,
        message: "Project link not found in this portfolio",
      });
    }

    // Delete the portfolio project relationship
    await prisma.portfolioProject.delete({
      where: {
        id: relatedProject,
      },
    });

    // Reorder remaining projects to ensure no gaps in order
    const remainingProjects = await prisma.portfolioProject.findMany({
      where: {
        portfolioId: portfolio.id,
      },
      orderBy: {
        order: "asc",
      },
    });

    // Update order for each remaining project
    for (let i = 0; i < remainingProjects.length; i++) {
      await prisma.portfolioProject.update({
        where: {
          id: remainingProjects[i].id,
        },
        data: {
          order: i,
        },
      });
    }

    // Get the updated portfolio with all its projects
    const updatedPortfolio = await prisma.portfolio.findUnique({
      where: { slug },
      include: {
        portfolioProjects: {
          include: {
            project: true,
            contentBlocks: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // Return success response with updated portfolio
    return {
      success: true,
      portfolio: updatedPortfolio,
    };
  } catch (error: any) {
    // Log error and return appropriate error response
    console.error("Error removing project from portfolio:", error);

    // Return the error if it's already a handled error
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Error removing project from portfolio",
    });
  }
});
