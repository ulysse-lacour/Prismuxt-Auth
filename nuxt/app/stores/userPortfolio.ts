import { defineStore } from "pinia";
import type { Portfolio } from "@prisma/client";

export const usePortfolioStore = defineStore("portfolioStore", {
  state: () => ({
    portfolios: [] as Array<Portfolio>,
  }),
  actions: {
    setPortfolios(newPortfolios: Array<Portfolio>) {
      this.portfolios = newPortfolios;
    },
    updatePortfolio(updatedPortfolio: Portfolio) {
      const index = this.portfolios.findIndex((p) => p.slug === updatedPortfolio.slug);
      if (index !== -1) {
        this.portfolios[index] = { ...this.portfolios[index], ...updatedPortfolio };
      }
    },
    addPortfolio(newPortfolio: Portfolio) {
      this.portfolios.push(newPortfolio);
    },
    deletePortfolio(deletedPortfolio: Portfolio) {
      this.portfolios = this.portfolios.filter((p) => p.id !== deletedPortfolio.id);
    },
  },
});
