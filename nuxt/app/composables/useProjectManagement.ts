import { useProjectData } from "@/composables/useProjectData";
import { useProjectStore } from "~/stores/userProjects";
import type { Project } from "@prisma/client";

export function useProjectManagement() {
  const projectStore = useProjectStore();
  const { processProjectData } = useProjectData();

  const fetchProject = async (id: string) => {
    const { data: project } = await useFetch(`/api/project/${id}`);

    return { project };
  };

  const createProject = async (data: Project) => {
    const createdProject = await $fetch(`/api/project`, {
      method: "POST",
      body: data,
    });

    if (createdProject) {
      // Update the projects store with updated project
      projectStore.addProject(processProjectData(createdProject.project));
    }

    return { createdProject };
  };

  const updateProject = async (id: string, data: Project) => {
    const updatedProject = await $fetch(`/api/project/${id}`, {
      method: "PUT",
      body: data,
    });

    if (updatedProject) {
      // Update the projects store with updated project
      projectStore.updateProject(processProjectData(updatedProject.project));
    }

    return { updatedProject };
  };

  const deleteProject = async (id: string) => {
    const deletedProject = await $fetch(`/api/project/${id}`, {
      method: "DELETE",
    });

    if (deletedProject) {
      // Update the projects store with deleted project
      projectStore.deleteProject(processProjectData(deletedProject.project));
    }

    return { deletedProject };
  };

  const fetchAllTags = async () => {
    const { data: allTags } = await useFetch(`/api/projects/tags`);

    return { allTags };
  };

  const createTag = async (name: string) => {
    const newTag = await $fetch(`/api/projects/tags`, {
      method: "POST",
      body: { name },
    });

    return { newTag };
  };

  const deleteTag = async (id: string) => {
    const deletedTag = await $fetch(`/api/projects/tags/${id}`, {
      method: "DELETE",
    });

    return { deletedTag };
  };

  const addTagsToProject = async (projectId: string, tagIds: string[]) => {
    const addedTags = await $fetch(`/api/project/${projectId}/tags`, {
      method: "POST",
      body: { tagIds },
    });

    return { addedTags };
  };

  const removeTagFromProject = async (projectId: string, tagId: string) => {
    const removedTag = await $fetch(`/api/project/${projectId}/tags/${tagId}`, {
      method: "DELETE",
    });

    return { removedTag };
  };

  return {
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    fetchAllTags,
    createTag,
    deleteTag,
    addTagsToProject,
    removeTagFromProject,
  };
}
