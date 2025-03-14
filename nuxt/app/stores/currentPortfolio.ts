import { defineStore } from "pinia";
import type { Portfolio, PortfolioProject, Project } from "@prisma/client";

// Extend Portfolio type to include portfolioProjects
interface ExtendedPortfolio extends Portfolio {
  portfolioProjects: (PortfolioProject & {
    project: Project;
  })[];
}

export const useCurrentPortfolioStore = defineStore("currentPortfolioStore", {
  state: () => ({
    currentPortfolio: {} as ExtendedPortfolio,
  }),
  actions: {
    setCurrentPortfolio(newCurrentPortfolio: ExtendedPortfolio) {
      this.currentPortfolio = newCurrentPortfolio;
    },
    updateCurrentPortfolio(updatedCurrentPortfolio: Partial<ExtendedPortfolio>) {
      this.currentPortfolio = { ...this.currentPortfolio, ...updatedCurrentPortfolio };
    },
  },
});
