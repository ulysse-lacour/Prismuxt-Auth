import { defineStore } from "pinia";

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
