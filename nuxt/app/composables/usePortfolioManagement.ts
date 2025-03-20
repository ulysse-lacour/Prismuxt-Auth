import { usePortfolioData } from "@/composables/useJsonDateConverter";
import { useCurrentPortfolioStore } from "@/stores/currentPortfolio";
import { usePortfoliosStore } from "~/stores/userPortfolios";
import type { Portfolio } from "@prisma/client";

/**
 * @composable
 *
 * @description A comprehensive composable for managing portfolios and their associated projects.
 * Provides functions for CRUD operations on portfolios and project-portfolio relationships.
 *
 * @returns {
 *   fetchAllPortfolios: () => Promise<{ portfolios: PortfolioDetails[] }> - Fetches all portfolios of the current user
 *   fetchPortfolio: (slug: string) => Promise<{ portfolio: PortfolioDetails }> - Fetches a single portfolio by slug
 *   createPortfolio: (data: Partial<Portfolio>) => Promise<{ createdPortfolio: PortfolioDetails }> - Creates a new portfolio
 *   updatePortfolio: (slug: string, data: Partial<Portfolio>) => Promise<{ updatedPortfolio: PortfolioDetails }> - Updates an existing portfolio
 *   deletePortfolio: (slug: string) => Promise<{ deletedPortfolio: PortfolioDetails }> - Deletes a portfolio
 *   addProjectToPortfolio: (slug: string, projectId: string) => Promise<{ updatedPortfolio: PortfolioDetails }> - Adds a project to a portfolio
 *   removeProjectFromPortfolio: (slug: string, portfolioProjectId: string) => Promise<{ updatedPortfolio: PortfolioDetails }> - Removes a project from a portfolio
 *   fetchAllProjects: (slug: string) => Promise<{ projects: Project[] }> - Fetches all projects with their link status to a portfolio
 * }
 */

export function usePortfolioManagement() {
  const portfoliosStore = usePortfoliosStore();
  const currentPortfolioStore = useCurrentPortfolioStore();
  const { processPortfolioData } = usePortfolioData();

  /**
   * @function fetchAllPortfolios
   *
   * @description Fetches all portfolios of the current user
   *
   * @returns Promise containing an array of portfolios with their associated projects
   */
  const fetchAllPortfolios = async () => {
    const { data: portfolios } = await useFetch<PortfolioDetails[]>("/api/portfolios");

    if (!portfolios.value) {
      return { portfolios: [] };
    }

    return { portfolios: portfolios.value };
  };

  /**
   * @function fetchPortfolio
   *
   * @description Fetches a single portfolio by its slug
   *
   * @param slug - The unique slug identifier for the portfolio to fetch
   *
   * @returns Promise containing the fetched portfolio data with its associated projects
   */
  const fetchPortfolio = async (slug: string) => {
    const portfolio = await $fetch<PortfolioDetails>(`/api/portfolios/single/${slug}`, {
      method: "GET",
    });

    return { portfolio };
  };

  /**
   * @function createPortfolio
   *
   * @description Creates a new portfolio with an auto-generated slug
   *
   * @param data - Portfolio data to create
   * @param data.name - Portfolio name (required)
   * @param data.description - Portfolio description (optional)
   *
   * @returns Promise containing the created portfolio data
   */
  const createPortfolio = async (data: Partial<Portfolio>) => {
    const createdPortfolio = await $fetch<PortfolioDetails>(`/api/portfolios/single`, {
      method: "POST",
      body: data,
    });

    if (createdPortfolio) {
      // Process the portfolio data
      const processedPortfolio = processPortfolioData(createdPortfolio);

      // Update the portfolios store with the new portfolio
      portfoliosStore.addPortfolio(processedPortfolio);
    }

    return { createdPortfolio };
  };

  /**
   * @function updatePortfolio
   *
   * @description Updates an existing portfolio's basic information
   *
   * @param slug - The unique slug identifier for the portfolio to update
   * @param data - Updated portfolio data
   * @param data.name - New portfolio name (optional)
   * @param data.description - New portfolio description (optional)
   *
   * @returns Promise containing the updated portfolio data
   */
  const updatePortfolio = async (slug: string, data: Partial<Portfolio>) => {
    const updatedPortfolio = await $fetch<{ updatedPortfolio: PortfolioDetails }>(
      `/api/portfolios/single/${slug}`,
      {
        method: "PUT",
        body: data,
      }
    );

    if (updatedPortfolio) {
      // Process the portfolio data
      const processedPortfolio = processPortfolioData(updatedPortfolio.updatedPortfolio);

      // Update the portfolios store with the updated portfolio
      portfoliosStore.updatePortfolio(processedPortfolio);
    }

    return { updatedPortfolio };
  };

  /**
   * @function deletePortfolio
   *
   * @description Deletes a portfolio and all its associated data
   *
   * @param slug - The unique slug identifier for the portfolio to delete
   *
   * @returns Promise containing the deleted portfolio data
   */
  const deletePortfolio = async (slug: string) => {
    const deletedPortfolio = await $fetch<{ deletedPortfolio: PortfolioDetails }>(
      `/api/portfolios/single/${slug}`,
      {
        method: "DELETE",
      }
    );

    console.log("deletedPortfolio", deletedPortfolio);

    if (deletedPortfolio) {
      // Process the portfolio data
      const processedPortfolio = processPortfolioData(deletedPortfolio.deletedPortfolio);

      // Update the portfolios store with the updated portfolio
      portfoliosStore.deletePortfolio(processedPortfolio);
    }

    return { deletedPortfolio };
  };

  /**
   * @function addProjectToPortfolio
   *
   * @description Adds a project to a portfolio with automatic ordering
   *
   * @param slug - The unique slug identifier for the portfolio
   * @param projectId - The ID of the project to add
   *
   * @returns Promise containing the updated portfolio with the added project
   */
  const addProjectToPortfolio = async (slug: string, projectId: string) => {
    try {
      const updatedPortfolio = await $fetch(`/api/portfolios/single/project`, {
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
   * @function removeProjectFromPortfolio
   *
   * @description Removes a project from a portfolio and reorders remaining projects
   *
   * @param slug - The unique slug identifier for the portfolio
   * @param portfolioProjectId - The ID of the portfolio-project relationship to remove
   *
   * @returns Promise containing the updated portfolio after project removal
   */
  const removeProjectFromPortfolio = async (slug: string, portfolioProjectId: string) => {
    try {
      const updatedPortfolio = await $fetch(`/api/portfolios/single/project`, {
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
   * @function fetchAllProjects
   *
   * @description Fetches all projects with their link status to a specific portfolio
   *
   * @param slug - The unique slug identifier for the portfolio
   *
   * @returns Promise containing an array of projects with isLinked property indicating if they're in the portfolio
   */
  const fetchAllProjects = async (slug: string) => {
    const { data: projects } = await useFetch(`/api/portfolios/single/projects`, {
      method: "GET",
      params: { slug },
    });

    return { projects };
  };

  return {
    fetchAllPortfolios,
    fetchPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    addProjectToPortfolio,
    removeProjectFromPortfolio,
    fetchAllProjects,
  };
}
