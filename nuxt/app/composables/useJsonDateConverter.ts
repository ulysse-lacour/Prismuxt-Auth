/**
 * Composable for processing portfolio data
 * Handles date string conversions to Date objects and data normalization
 * @returns Object containing portfolio data processing functions
 */
export const usePortfolioData = () => {
  /**
   * Processes portfolio data by converting ISO date strings to JavaScript Date objects
   *
   * @param portfolioData - Raw portfolio data from API with string dates
   * @returns Processed portfolio data with proper Date objects
   */
  const processPortfolioData = (portfolioData: any) => {
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

/**
 * Composable for processing project data
 * Handles date string conversions to Date objects and data normalization
 * @returns Object containing project data processing functions
 */
export const useProjectData = () => {
  /**
   * Processes project data by converting ISO date strings to JavaScript Date objects
   *
   * @param projectData - Raw project data from API with string dates
   * @returns Processed project data with proper Date objects
   */
  const processProjectData = (projectData: any) => {
    // Handle array or object data differently
    if (Array.isArray(projectData)) {
      // Process array of projects
      const projectWithDates = projectData.map((project) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
      }));

      return projectWithDates;
    } else if (projectData) {
      // Process single project object
      const projectWithDates = {
        ...projectData,
        createdAt: new Date(projectData.createdAt),
        updatedAt: new Date(projectData.updatedAt),
      };

      return projectWithDates;
    }
  };

  return {
    processProjectData,
  };
};

/**
 * Composable for processing user data
 * Handles date string conversions to Date objects and normalizes related collections
 * @returns Object containing user data processing functions
 */
export const useUserData = () => {
  /**
   * Processes user data by converting ISO date strings to JavaScript Date objects
   * Also processes nested projects and portfolios collections
   *
   * @param userData - Raw user data from API with string dates
   * @returns Processed user data with proper Date objects
   */
  const processUserData = (userData: any) => {
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

/**
 * Composable for processing projectContent data
 * Handles date string conversions to Date objects and normalizes related collections
 * @returns Object containing projectContent data processing functions
 */
export const useProjectContentData = () => {
  /**
   * Processes projectContent data by converting ISO date strings to JavaScript Date objects
   * Also processes nested content blocks and language data
   *
   * @param projectContentData - Raw projectContent data from API with string dates
   * @returns Processed projectContent data with proper Date objects
   */
  const processProjectContentData = (projectContentData: any) => {
    const projectContentWithDates = {
      ...projectContentData,
      createdAt: new Date(projectContentData.createdAt),
      updatedAt: new Date(projectContentData.updatedAt),
      contentBlocks: (projectContentData.contentBlocks || []).map((block) => ({
        ...block,
        createdAt: new Date(block.createdAt),
        updatedAt: new Date(block.updatedAt),
      })),
      language: projectContentData.language
        ? {
            ...projectContentData.language,
            createdAt: new Date(projectContentData.language.createdAt),
            updatedAt: new Date(projectContentData.language.updatedAt),
          }
        : null,
    };

    return projectContentWithDates;
  };

  return {
    processProjectContentData,
  };
};

/**
 * Composable for processing Json data to Date objects
 * Handles date string conversions to Date objects and normalizes related collections
 * @returns Object containing Json data to Date objects processing functions
 */
export const useJsonToDate = () => {
  /**
   * Processes Json data by converting ISO date strings to JavaScript Date objects
   * Also processes nested projects and portfolios collections
   *
   * @param JsonData - Raw Json data from API with string dates
   * @returns Processed Json data with proper Date objects
   */
  const processData = (jsonData: any) => {
    const jsonWithDates = {
      ...jsonData,
      createdAt: new Date(jsonData.createdAt),
      updatedAt: new Date(jsonData.updatedAt),
    };

    return jsonWithDates;
  };

  return {
    processData,
  };
};
