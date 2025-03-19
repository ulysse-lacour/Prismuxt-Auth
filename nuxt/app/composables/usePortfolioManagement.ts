import { usePortfolioData } from "@/composables/useJsonDateConverter";
import { useCurrentPortfolioStore } from "@/stores/currentPortfolio";
import { usePortfoliosStore } from "~/stores/userPortfolios";
import type { Portfolio } from "@prisma/client";

/**
 * Portfolio Management Composable
 *
 * Provides a set of functions for managing portfolios, including:
 * - Fetching, creating, updating, and deleting portfolios
 * - Managing projects within portfolios (adding/removing)
 * - Retrieving available projects for a portfolio
 *
 * This composable integrates with the portfolio stores to keep UI state in sync
 * with server-side changes.
 *
 * @returns Object containing portfolio management functions
 */
export function usePortfolioManagement() {
  const portfoliosStore = usePortfoliosStore();
  const currentPortfolioStore = useCurrentPortfolioStore();
  const { processPortfolioData } = usePortfolioData();

  /**
   * Fetches a portfolio by its slug and updates the current portfolio store
   *
   * @param slug - The unique slug identifier for the portfolio
   * @returns Object containing the fetched portfolio
   */
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

  /**
   * Creates a new portfolio and adds it to the portfolios store
   *
   * @param data - Portfolio data (name, description, etc.)
   * @returns Object containing the created portfolio
   */
  const createPortfolio = async (data: Partial<Portfolio>) => {
    const createdPortfolio = await $fetch(`/api/portfolio`, {
      method: "POST",
      body: data,
    });

    if (createdPortfolio) {
      // Update the portfolios store with the new portfolio
      portfoliosStore.addPortfolio(processPortfolioData(createdPortfolio));
    }

    return { createdPortfolio };
  };

  /**
   * Updates an existing portfolio and updates the portfolios store
   *
   * @param slug - The unique slug identifier for the portfolio to update
   * @param data - Updated portfolio data (name, description, etc.)
   * @returns Object containing the updated portfolio
   */
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

  /**
   * Deletes a portfolio and removes it from the portfolios store
   *
   * @param slug - The unique slug identifier for the portfolio to delete
   * @returns Object indicating success status
   */
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

  /**
   * Adds a project to a portfolio
   *
   * @param slug - The unique slug identifier for the portfolio
   * @param projectId - The ID of the project to add
   * @returns Object containing the updated portfolio with the added project
   */
  const addProjectToPortfolio = async (slug: string, projectId: string) => {
    try {
      const updatedPortfolio = await $fetch(`/api/portfolio/project`, {
        method: "POST",
        body: {
          slug,
          relatedProject: projectId,
        },
      });

      if (updatedPortfolio?.portfolio) {
        // Process the portfolio data
        const processedPortfolio = processPortfolioData(updatedPortfolio.portfolio);

        // Update the portfolios store with the updated portfolio
        portfoliosStore.updatePortfolio(processedPortfolio);

        // Also update the current portfolio store
        currentPortfolioStore.setCurrentPortfolio(processedPortfolio);
      }

      return { updatedPortfolio };
    } catch (error: any) {
      console.error("Error adding project to portfolio:", error);
      throw new Error(error.data?.message || "Failed to add project to portfolio");
    }
  };

  /**
   * Removes a project from a portfolio
   *
   * @param slug - The unique slug identifier for the portfolio
   * @param portfolioProjectId - The ID of the portfolio-project relationship to remove
   * @returns Object containing the updated portfolio after project removal
   */
  const removeProjectFromPortfolio = async (slug: string, portfolioProjectId: string) => {
    try {
      const updatedPortfolio = await $fetch(`/api/portfolio/project`, {
        method: "DELETE",
        body: {
          slug,
          relatedProject: portfolioProjectId,
        },
      });

      if (updatedPortfolio?.portfolio) {
        // Process the portfolio data
        const processedPortfolio = processPortfolioData(updatedPortfolio.portfolio);

        // Update the portfolios store with the updated portfolio
        portfoliosStore.updatePortfolio(processedPortfolio);

        // Also update the current portfolio store
        currentPortfolioStore.setCurrentPortfolio(processedPortfolio);
      }

      return { updatedPortfolio };
    } catch (error: any) {
      console.error("Error removing project from portfolio:", error);
      throw new Error(error.data?.message || "Failed to remove project from portfolio");
    }
  };

  /**
   * Fetches all projects with their link status to a specific portfolio
   *
   * @param slug - The unique slug identifier for the portfolio
   * @returns Array of projects with isLinked property indicating if they're in the portfolio
   */
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
