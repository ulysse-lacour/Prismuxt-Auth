import { usePortfolioData } from "@/composables/useJsonDateConverter";
import { useCurrentPortfolioStore } from "@/stores/currentPortfolio";
import { usePortfoliosStore } from "~/stores/userPortfolios";
import type { Portfolio } from "@prisma/client";

export function usePortfolioManagement() {
  const portfoliosStore = usePortfoliosStore();
  const currentPortfolioStore = useCurrentPortfolioStore();
  const { processPortfolioData } = usePortfolioData();

  const fetchPortfolio = async (slug: string) => {
    const portfolio = await $fetch(`/api/portfolio`, {
      params: { slug },
    });

    if (portfolio) {
      // Update the current portfolio store
      currentPortfolioStore.setCurrentPortfolio(processPortfolioData(portfolio.portfolio));
    }

    return { portfolio };
  };

  const createPortfolio = async (data: Partial<Portfolio>) => {
    const createdPortfolio = await $fetch(`/api/portfolio`, {
      method: "POST",
      body: data,
    });

    if (createdPortfolio) {
      // Update the portfolios store with the new portfolio
      portfoliosStore.addPortfolio(processPortfolioData(createdPortfolio.portfolio));
    }

    return { createdPortfolio };
  };

  const updatePortfolio = async (slug: string, data: Partial<Portfolio>) => {
    const updatedPortfolio = await $fetch(`/api/portfolio`, {
      method: "PUT",
      params: { slug },
      body: { ...data },
    });

    if (updatedPortfolio) {
      // Update the portfolios store with updated portfolio
      portfoliosStore.updatePortfolio(processPortfolioData(updatedPortfolio.portfolio));
    }

    return { updatedPortfolio };
  };

  const deletePortfolio = async (slug: string) => {
    const deletedPortfolio = await $fetch(`/api/portfolio`, {
      method: "DELETE",
      params: { slug },
    });

    if (deletedPortfolio) {
      // Update the portfolios store with deleted portfolio
      portfoliosStore.deletePortfolio(processPortfolioData(deletedPortfolio.portfolio));
    }

    return { deletedPortfolio };
  };

  // Projects
  const addProjectToPortfolio = async (slug: string, projectId: string) => {
    const updatedPortfolio = await $fetch(`/api/portfolio/project`, {
      method: "POST",
      body: { slug, relatedProject: projectId },
    });

    if (updatedPortfolio) {
      // Process the portfolio data
      const processedPortfolio = processPortfolioData(updatedPortfolio.portfolio);

      // Update the portfolios store with the updated portfolio
      portfoliosStore.updatePortfolio(processedPortfolio);

      // Also update the current portfolio store
      currentPortfolioStore.setCurrentPortfolio(processedPortfolio);
    }

    return { updatedPortfolio };
  };

  const removeProjectFromPortfolio = async (slug: string, portfolioProjectId: string) => {
    const updatedPortfolio = await $fetch(`/api/portfolio/project`, {
      method: "DELETE",
      body: { slug, relatedProject: portfolioProjectId },
    });

    if (updatedPortfolio) {
      // Process the portfolio data
      const processedPortfolio = processPortfolioData(updatedPortfolio.portfolio);

      // Update the portfolios store with the updated portfolio
      portfoliosStore.updatePortfolio(processedPortfolio);

      // Also update the current portfolio store
      currentPortfolioStore.setCurrentPortfolio(processedPortfolio);
    }

    return { updatedPortfolio };
  };

  const fetchAllProjects = async (slug: string) => {
    const { data: projects } = await useFetch(`/api/portfolio/projects`, {
      method: "GET",
      params: { slug },
    });

    return { projects };
  };

  return {
    fetchPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    addProjectToPortfolio,
    removeProjectFromPortfolio,
    fetchAllProjects,
  };
}
