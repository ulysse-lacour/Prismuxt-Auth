import { defineStore } from "pinia";

export const useProjectStore = defineStore("projectStore", {
  state: () => ({
    projects: [] as Array<{ url: string; title: string }>,
  }),
  actions: {
    setProjects(newProjects) {
      this.projects = newProjects;
    },
    updateProject(updatedProject) {
      const index = this.projects.findIndex((p) => p.url === updatedProject.url);
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...updatedProject };
      }
    },
  },
});
