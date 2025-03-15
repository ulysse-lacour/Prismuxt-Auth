import { defineStore } from "pinia";
import type { Portfolio, PortfolioProject, Project } from "@prisma/client";

/**
 * Extended Portfolio Interface
 *
 * Extends the base Portfolio type to include related portfolio projects
 * with their associated project data. This provides a complete data structure
 * for displaying a portfolio with all its projects.
 */
interface ExtendedPortfolio extends Portfolio {
  portfolioProjects: (PortfolioProject & {
    project: Project;
  })[];
}

/**
 * Current Portfolio Store
 *
 * Manages the currently active portfolio being viewed or edited.
 * This store is separate from the user portfolios store to allow
 * for detailed viewing and editing of a single portfolio without
 * affecting the list of all portfolios.
 */
export const useCurrentPortfolioStore = defineStore("currentPortfolioStore", {
  state: () => ({
    currentPortfolio: {} as ExtendedPortfolio, // Currently active portfolio with projects
  }),
  actions: {
    /**
     * Sets the current portfolio
     * Used when navigating to a portfolio detail view
     *
     * @param newCurrentPortfolio - Complete portfolio object to set as current
     */
    setCurrentPortfolio(newCurrentPortfolio: ExtendedPortfolio) {
      this.currentPortfolio = newCurrentPortfolio;
    },

    /**
     * Updates properties of the current portfolio
     * Used when editing portfolio details or modifying its projects
     *
     * @param updatedCurrentPortfolio - Partial portfolio object with properties to update
     */
    updateCurrentPortfolio(updatedCurrentPortfolio: Partial<ExtendedPortfolio>) {
      this.currentPortfolio = { ...this.currentPortfolio, ...updatedCurrentPortfolio };
    },
  },
});
