import { auth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const session = await auth.api.getSession(event);

    if (!session) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const body = await readBody(event);
    const { slug } = body;

    // Delete the portfolio
    const deletedPortfolio = await prisma.portfolio.delete({
      where: { slug },
    });

    return {
      success: true,
      portfolio: deletedPortfolio,
    };
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    throw createError({
      statusCode: 500,
      message: "Error deleting portfolio",
    });
  }
});
