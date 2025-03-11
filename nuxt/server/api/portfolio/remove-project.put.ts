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

    // Delete the portfolio project relationship
    await prisma.portfolioProject.delete({
      where: {
        id: relatedProject,
      },
    });

    // Get the updated portfolio with all its projects
    const updatedPortfolio = await prisma.portfolio.findUnique({
      where: { slug },
      include: {
        portfolioProjects: {
          include: {
            project: true,
            contentBlocks: true,
          },
        },
      },
    });

    return {
      success: true,
      portfolio: updatedPortfolio,
    };
  } catch (error: any) {
    console.error("Error removing project from portfolio:", error);
    throw createError({
      statusCode: 500,
      message: `Error removing project from portfolio: ${error.message}`,
    });
  }
});
