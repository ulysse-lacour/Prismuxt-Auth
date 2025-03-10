import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { slug, name, description } = body;

    // Update portfolio data
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
  } catch (error) {
    console.error("Error updating portfolio:", error);
    throw createError({
      statusCode: 500,
      message: "Error updating portfolio",
    });
  }
});
