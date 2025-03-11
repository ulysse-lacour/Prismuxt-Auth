import type { Portfolio, PortfolioProject, Project } from "@prisma/client";

declare global {
  // Declare custom types in here

  // Add a new type that extends the Project type with a boolean property to check for linked to current portfolio status
  interface ProjectWithLinkStatus extends Project {
    isLinked: boolean;
  }
}
export {};
