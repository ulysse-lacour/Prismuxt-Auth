import { defineStore } from "pinia";
import type { Portfolio } from "@prisma/client";

/**
 * User Portfolios Store
 *
 * Manages the current user's portfolios throughout the application.
 * This store maintains a list of portfolios owned by the user and
 * provides methods to add, update, and delete portfolios.
 */
export const usePortfoliosStore = defineStore("portfoliosStore", {
  state: () => ({
    portfolios: [] as Array<Portfolio>, // Array of user's portfolios
  }),
  actions: {
    /**
     * Sets the complete portfolios array
     * Used primarily after initial data fetch
     *
     * @param newPortfolios - Array of portfolios to set
     */
    setPortfolios(newPortfolios: Array<Portfolio>) {
      this.portfolios = newPortfolios;
    },

    /**
     * Updates a specific portfolio in the array
     * Finds the portfolio by slug and updates its properties
     *
     * @param updatedPortfolio - Portfolio with updated properties
     */
    updatePortfolio(updatedPortfolio: Portfolio) {
      const index = this.portfolios.findIndex((p) => p.slug === updatedPortfolio.slug);
      if (index !== -1) {
        this.portfolios[index] = { ...this.portfolios[index], ...updatedPortfolio };
      }
    },

    /**
     * Adds a new portfolio to the array
     * Used after creating a new portfolio
     *
     * @param newPortfolio - New portfolio to add
     */
    addPortfolio(newPortfolio: Portfolio) {
      this.portfolios.push(newPortfolio);
    },

    /**
     * Removes a portfolio from the array
     * Used after deleting a portfolio
     *
     * @param deletedPortfolio - Portfolio to remove
     */
    deletePortfolio(deletedPortfolio: Portfolio) {
      this.portfolios = this.portfolios.filter((p) => p.id !== deletedPortfolio.id);
    },
  },
});
