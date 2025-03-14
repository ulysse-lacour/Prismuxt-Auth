import prisma from "~/utils/prisma";

/**
 * API endpoint to add a project to a portfolio
 * PUT /api/portfolio/add-project
 *
 * Request body:
 * {
 *   slug: string;        // Portfolio slug
 *   relatedProject: string;  // Project ID to add
 * }
 *
 * Returns the updated portfolio with all related projects
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
        message: "Project ID is required",
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

    // Check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: relatedProject },
    });

    if (!project) {
      throw createError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    // Check if the project is already linked to this portfolio
    const existingLink = await prisma.portfolioProject.findUnique({
      where: {
        portfolioId_projectId: {
          portfolioId: portfolio.id,
          projectId: relatedProject,
        },
      },
    });

    if (existingLink) {
      throw createError({
        statusCode: 400,
        message: "Project is already linked to this portfolio",
      });
    }

    // Get the count of existing projects to determine the order
    const projectCount = await prisma.portfolioProject.count({
      where: { portfolioId: portfolio.id },
    });

    // Update portfolio by adding the project
    const updatedPortfolio = await prisma.portfolio.update({
      where: { slug },
      data: {
        // Create a new PortfolioProject record
        portfolioProjects: {
          create: {
            projectId: relatedProject,
            order: projectCount, // Set the order based on the current count
          },
        },
      },
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
    console.error("Error adding project to portfolio:", error);

    // Return the error if it's already a handled error
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      message: "Error adding project to portfolio",
    });
  }
});
