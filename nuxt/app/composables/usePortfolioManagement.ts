import { usePortfolioData } from "@/composables/usePortfolioData";
import { useCurrentPortfolioStore } from "@/stores/currentPortfolio";
import { usePortfolioStore } from "~/stores/userPortfolio";
import type { Portfolio } from "@prisma/client";

export function usePortfolioManagement() {
  const portfolioStore = usePortfolioStore();
  const currentPortfolioStore = useCurrentPortfolioStore();
  const { processPortfolioData } = usePortfolioData();

  const fetchPortfolio = async (slug: string) => {
    const portfolio = await $fetch(`/api/portfolio/single`, {
      params: { slug },
    });

    if (portfolio) {
      // Update the current portfolio store
      currentPortfolioStore.setCurrentPortfolio(processPortfolioData(portfolio.portfolio));
    }

    return { portfolio };
  };

  const createPortfolio = async (data: Portfolio) => {
    const createdPortfolio = await $fetch(`/api/portfolio/single`, {
      method: "POST",
      body: data,
    });

    if (createdPortfolio) {
      // Update the portfolios store with the new portfolio
      portfolioStore.addPortfolio(processPortfolioData(createdPortfolio.portfolio));
    }

    return { createdPortfolio };
  };

  const updatePortfolio = async (slug: string, data: Partial<Portfolio>) => {
    const updatedPortfolio = await $fetch(`/api/portfolio/single`, {
      method: "PUT",
      params: { slug },
      body: { ...data },
    });

    if (updatedPortfolio) {
      // Update the portfolios store with updated portfolio
      portfolioStore.updatePortfolio(processPortfolioData(updatedPortfolio.portfolio));
    }

    return { updatedPortfolio };
  };

  const deletePortfolio = async (slug: string) => {
    const deletedPortfolio = await $fetch(`/api/portfolio/single`, {
      method: "DELETE",
      params: { slug },
    });

    if (deletedPortfolio) {
      // Update the portfolios store with deleted portfolio
      portfolioStore.deletePortfolio(processPortfolioData(deletedPortfolio.portfolio));
    }

    return { deletedPortfolio };
  };

  // Projects

  const addProjectToPortfolio = async (slug: string, projectId: string) => {
    const updatedPortfolio = await $fetch(`/api/portfolio/single/project`, {
      method: "POST",
      body: { slug, relatedProject: projectId },
    });

    if (updatedPortfolio) {
      // Update the portfolios store with the updated portfolio
      portfolioStore.updatePortfolio(processPortfolioData(updatedPortfolio.portfolio));
    }

    return { updatedPortfolio };
  };

  const removeProjectFromPortfolio = async (slug: string, portfolioProjectId: string) => {
    const updatedPortfolio = await $fetch(`/api/portfolio/single/project`, {
      method: "DELETE",
      body: { slug, relatedProject: portfolioProjectId },
    });

    if (updatedPortfolio) {
      // Update the portfolios store with the updated portfolio
      portfolioStore.updatePortfolio(processPortfolioData(updatedPortfolio.portfolio));
    }

    return { updatedPortfolio };
  };

  const fetchAllProjects = async (slug: string) => {
    const { data: projects } = await useFetch(`/api/portfolio/single/projects`, {
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
