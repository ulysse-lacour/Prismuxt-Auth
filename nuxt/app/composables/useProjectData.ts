/**
 * Composable for processing project data
 * Handles date conversions and data normalization
 */
export const useProjectData = () => {
  /**
   * Process project data by converting date strings to Date objects
   * @param projectData - Raw project data from API
   * @returns Processed project data with proper date objects
   */
  const processProjectData = (projectData) => {
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
