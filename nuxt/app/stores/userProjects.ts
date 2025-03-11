import { defineStore } from "pinia";
import type { Project } from "@prisma/client";

export const useProjectStore = defineStore("projectStore", {
  state: () => ({
    projects: [] as Array<Project>,
  }),
  actions: {
    setProjects(newProjects: Array<Project>) {
      this.projects = newProjects;
    },
    updateProject(updatedProject: Project) {
      const index = this.projects.findIndex((p) => p.id === updatedProject.id);
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...updatedProject };
      }
    },
  },
});
