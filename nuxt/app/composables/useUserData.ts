/**
 * Composable for processing portfolio data
 * Handles date conversions and data normalization
 */
export const useUserData = () => {
  /**
   * Process portfolio data by converting date strings to Date objects
   * @param portfolioData - Raw portfolio data from API
   * @returns Processed portfolio data with proper date objects
   */
  const processUserData = (userData) => {
    const userWithDates = {
      ...userData,
      createdAt: new Date(userData.createdAt),
      updatedAt: new Date(userData.updatedAt),
      projects: (userData.projects || []).map((project) => ({
        ...project,
        createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
        updatedAt: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      })),
      portfolios: (userData.portfolios || []).map((portfolio) => ({
        ...portfolio,
        createdAt: new Date(portfolio.createdAt),
        updatedAt: new Date(portfolio.updatedAt),
      })),
    };

    return userWithDates;
  };

  return {
    processUserData,
  };
};
