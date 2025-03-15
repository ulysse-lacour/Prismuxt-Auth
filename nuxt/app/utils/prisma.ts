import { Prisma, PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton Factory
 *
 * Creates a singleton instance of PrismaClient with custom extensions.
 * This function extends the base PrismaClient with additional utility methods
 * that can be used across all models.
 *
 * @returns Extended PrismaClient instance
 */
const prismaClientSingleton = () => {
  // Extend the PrismaClient with custom methods for all models
  return new PrismaClient().$extends({
    model: {
      $allModels: {
        /**
         * Check if a record exists in the database
         *
         * This utility method allows checking for existence without fetching the entire record,
         * which is more efficient than using findFirst and checking for null.
         *
         * @param where - Query conditions to find the record
         * @returns Boolean indicating if a matching record exists
         */
        async exists<T>(this: T, where: Prisma.Args<T, "findFirst">["where"]): Promise<boolean> {
          const context = Prisma.getExtensionContext(this);
          const result = await (context as any).findFirst({ where });
          return result !== null;
        },
      },
    },
  });
};

/**
 * Type declaration for global Prisma instance
 * Ensures TypeScript recognizes the global prisma instance
 */
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

/**
 * Singleton Prisma instance
 *
 * Uses an existing global instance if available, or creates a new one.
 * This pattern ensures only one connection to the database is maintained
 * throughout the application lifecycle.
 */
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// In development, save the instance to the global object to prevent
// multiple connections during hot module replacement
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
