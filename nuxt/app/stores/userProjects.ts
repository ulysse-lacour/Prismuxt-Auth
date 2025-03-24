import { defineStore } from "pinia";
import type { Project } from "@prisma/client";

/**
 * User Projects Store
 *
 * Manages the current user's projects throughout the application.
 * This store maintains a list of projects owned by the user and
 * provides methods to add, update, and delete projects.
 */
export const useProjectStore = defineStore("projectStore", {
  state: () => ({
    projects: [] as Array<Project>, // Array of user's projects
  }),
  actions: {
    /**
     * Sets the complete projects array
     * Used primarily after initial data fetch
     *
     * @param newProjects - Array of projects to set
     */
    setProjects(newProjects: Array<Project>) {
      this.projects = newProjects;
    },

    /**
     * Updates a specific project in the array
     * Finds the project by ID and updates its properties
     *
     * @param updatedProject - Project with updated properties
     */
    updateProject(updatedProject: Project) {
      const index = this.projects.findIndex((p) => p.id === updatedProject.id);
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...updatedProject };
      }
    },

    /**
     * Adds a new project to the array
     * Used after creating a new project
     *
     * @param newProject - New project to add
     */
    addProject(newProject: Project) {
      this.projects.push(newProject);
    },

    /**
     * Removes a project from the array
     * Used after deleting a project
     *
     * @param deletedProject - Project to remove
     */
    deleteProject(deletedProject: Project) {
      this.projects = this.projects.filter((p) => p.id !== deletedProject.id);
    },
  },
});
