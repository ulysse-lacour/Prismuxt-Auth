import { defineStore } from "pinia";
import type { Project } from "@prisma/client";

/**
 * Current Edited Project Store
 *
 * Manages the currently active project being edited.
 * This store is separate from the user projects store to allow
 * for detailed viewing and editing of a single project without
 * affecting the list of all projects.
 */
export const useCurrentEditedProjectStore = defineStore("currentEditedProjectStore", {
  state: () => ({
    currentProject: {} as Project, // Currently active project
  }),
  actions: {
    /**
     * Sets the current project
     * Used when navigating to a project detail view
     *
     * @param newCurrentProject - Complete project object to set as current
     */
    setCurrentProject(newCurrentProject: Project) {
      this.currentProject = newCurrentProject;
    },

    /**
     * Updates properties of the current project
     * Used when editing project details or modifying its projects
     *
     * @param updatedCurrentProject - Partial project object with properties to update
     */
    updateCurrentProject(updatedCurrentProject: Partial<Project>) {
      this.currentProject = { ...this.currentProject, ...updatedCurrentProject };
    },
  },
});
