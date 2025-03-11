import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { slug, name, description } = body;

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

    // Update portfolio basic data
    const updatedPortfolio = await prisma.portfolio.update({
      where: { slug },
      data: {
        name,
        description,
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
