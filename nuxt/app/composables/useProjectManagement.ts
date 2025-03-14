import { useProjectData } from "@/composables/useJsonDateConverter";
import { useProjectStore } from "~/stores/userProjects";
import type { Project } from "@prisma/client";

export function useProjectManagement() {
  const projectStore = useProjectStore();
  const { processProjectData } = useProjectData();

  const fetchProject = async (id: string) => {
    const { data: project } = await useFetch(`/api/project/${id}`);

    return { project };
  };

  const createProject = async (data: Partial<Project>) => {
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

  const updateProject = async (id: string, data: Partial<Project>) => {
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

  // Tags

  const fetchAllTags = async () => {
    try {
      const allTags = await $fetch(`/api/projects/tags`, {
        method: "GET",
      });

      return { allTags };
    } catch (error) {
      console.error("Error fetching tags:", error);
      // Return an empty tags array to prevent errors
      return { allTags: { tags: [] } };
    }
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

  const addTagToProject = async (projectId: string, tagId: string) => {
    const addedTag = await $fetch(`/api/project/${projectId}/tags`, {
      method: "POST",
      body: { tagId },
    });

    return { addedTag };
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
    addTagToProject,
    removeTagFromProject,
  };
}
