import { defineStore } from "pinia";
import type { Portfolio } from "@prisma/client";

export const usePortfolioStore = defineStore("portfolioStore", {
  state: () => ({
    portfolios: [] as Array<Portfolio>,
  }),
  actions: {
    setPortfolios(newPortfolios) {
      this.portfolios = newPortfolios;
    },
    updatePortfolio(updatedPortfolio) {
      const index = this.portfolios.findIndex((p) => p.slug === updatedPortfolio.slug);
      if (index !== -1) {
        this.portfolios[index] = { ...this.portfolios[index], ...updatedPortfolio };
      }
    },
  },
});
