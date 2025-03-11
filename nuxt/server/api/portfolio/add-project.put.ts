import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { slug, relatedProject } = body;

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

    // Get the count of existing projects to determine the order
    const projectCount = await prisma.portfolioProject.count({
      where: { portfolioId: portfolio.id },
    });

    // Update portfolio basic data
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
          },
        },
      },
    });

    return {
      success: true,
      portfolio: updatedPortfolio,
    };
  } catch (error: any) {
    console.error("Error updating portfolio:", error);
    throw createError({
      statusCode: 500,
      message: `Error updating portfolio: ${error.message}`,
    });
  }
});
