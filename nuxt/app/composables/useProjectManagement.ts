import { useProjectData } from "@/composables/useJsonDateConverter";
import { useProjectStore } from "~/stores/userProjects";
import type { Project } from "@prisma/client";

/**
 * Project Management Composable
 *
 * Provides a set of functions for managing projects, including:
 * - Fetching, creating, updating, and deleting projects
 * - Managing tags (creating, deleting, adding to projects, removing from projects)
 *
 * This composable integrates with the project store to keep UI state in sync
 * with server-side changes.
 *
 * @returns Object containing project management functions
 */
export function useProjectManagement() {
  const projectStore = useProjectStore();
  const { processProjectData } = useProjectData();

  /**
   * Fetches a project by its ID
   *
   * @param id - The unique identifier for the project
   * @returns Object containing the fetched project
   */
  const fetchProject = async (id: string) => {
    const project = await $fetch(`/api/project/${id}`);

    return { project };
  };

  /**
   * Creates a new project and adds it to the projects store
   *
   * @param data - Project data (name, description, etc.)
   * @returns Object containing the created project
   */
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

  /**
   * Updates an existing project and updates the projects store
   *
   * @param id - The unique identifier for the project to update
   * @param data - Updated project data (name, description, etc.)
   * @returns Object containing the updated project
   */
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

  /**
   * Deletes a project and removes it from the projects store
   *
   * @param id - The unique identifier for the project to delete
   * @returns Object indicating success status
   */
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

  /**
   * Fetches all tags available for the current user
   *
   * @returns Array of tags with their IDs and names
   */
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

  /**
   * Creates a new tag
   *
   * @param name - The name for the new tag
   * @returns Object containing the created tag
   */
  const createTag = async (name: string) => {
    const newTag = await $fetch(`/api/projects/tags`, {
      method: "POST",
      body: { name },
    });

    return { newTag };
  };

  /**
   * Deletes a tag
   *
   * @param id - The unique identifier for the tag to delete
   * @returns Object indicating success status
   */
  const deleteTag = async (id: string) => {
    const deletedTag = await $fetch(`/api/projects/tags/${id}`, {
      method: "DELETE",
    });

    return { deletedTag };
  };

  /**
   * Adds a tag to a project
   *
   * @param projectId - The unique identifier for the project
   * @param tagId - The unique identifier for the tag to add
   * @returns Object containing the updated project with the added tag
   */
  const addTagToProject = async (projectId: string, tagId: string) => {
    const addedTag = await $fetch(`/api/project/${projectId}/tags`, {
      method: "POST",
      body: { tagId },
    });

    return { addedTag };
  };

  /**
   * Removes a tag from a project
   *
   * @param projectId - The unique identifier for the project
   * @param tagId - The unique identifier for the tag to remove
   * @returns Object containing the updated project after tag removal
   */
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
