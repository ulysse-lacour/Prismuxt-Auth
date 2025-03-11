/**
 * Composable for processing portfolio data
 * Handles date conversions and data normalization
 */
export const usePortfolioData = () => {
  /**
   * Process portfolio data by converting date strings to Date objects
   * @param portfolioData - Raw portfolio data from API
   * @returns Processed portfolio data with proper date objects
   */
  const processPortfolioData = (portfolioData) => {
    // Handle array or object data differently
    if (Array.isArray(portfolioData)) {
      // Process array of portfolios
      const portfolioWithDates = portfolioData.map((portfolio) => ({
        ...portfolio,
        createdAt: new Date(portfolio.createdAt),
        updatedAt: new Date(portfolio.updatedAt),
        portfolioProjects: (portfolio.portfolioProjects || []).map((pp) => ({
          ...pp,
          createdAt: pp.createdAt ? new Date(pp.createdAt) : new Date(),
          updatedAt: pp.updatedAt ? new Date(pp.updatedAt) : new Date(),
          project: {
            ...pp.project,
            createdAt: new Date(pp.project.createdAt),
            updatedAt: new Date(pp.project.updatedAt),
          },
          contentBlocks: pp.contentBlocks || [],
        })),
      }));

      return portfolioWithDates;
    } else if (portfolioData) {
      // Process single portfolio object
      const portfolioWithDates = {
        ...portfolioData,
        createdAt: new Date(portfolioData.createdAt),
        updatedAt: new Date(portfolioData.updatedAt),
        portfolioProjects: (portfolioData.portfolioProjects || []).map((pp) => ({
          ...pp,
          createdAt: pp.createdAt ? new Date(pp.createdAt) : new Date(),
          updatedAt: pp.updatedAt ? new Date(pp.updatedAt) : new Date(),
          project: {
            ...pp.project,
            createdAt: new Date(pp.project.createdAt),
            updatedAt: new Date(pp.project.updatedAt),
          },
          contentBlocks: pp.contentBlocks || [],
        })),
      };

      return portfolioWithDates;
    }
  };

  return {
    processPortfolioData,
  };
};
