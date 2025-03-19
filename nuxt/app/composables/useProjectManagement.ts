import { useProjectData } from "@/composables/useJsonDateConverter";
import { useCurrentEditedProjectStore } from "~/stores/currentEditedProject";
import { useProjectStore } from "~/stores/userProjects";
import type { Project } from "@prisma/client";

/**
 * @composable
 *
 * @description A comprehensive composable for managing projects and their associated tags.
 * Provides functions for CRUD operations on projects and tags, with automatic store updates
 * to keep UI state in sync with server-side changes.
 *
 * @returns {
 *   // Project Management
 *   fetchProject: (id: string) => Promise<{ project: Project }> - Fetches a single project by ID
 *   createProject: (data: Partial<Project>) => Promise<{ createdProject: Project }> - Creates a new project
 *   updateProject: (id: string, data: Partial<Project>) => Promise<{ updatedProject: Project }> - Updates an existing project
 *   deleteProject: (id: string) => Promise<{ deletedProject: Project }> - Deletes a project
 *
 *   // Tag Management
 *   fetchAllTags: () => Promise<{ allTags: Tag[] }> - Fetches all available tags
 *   createTag: (name: string) => Promise<{ newTag: Tag }> - Creates a new tag
 *   deleteTag: (id: string) => Promise<{ deletedTag: Tag }> - Deletes a tag
 *   addTagToProject: (projectId: string, tagId: string) => Promise<{ addedTag: ProjectTag }> - Adds a tag to a project
 *   removeTagFromProject: (projectId: string, tagId: string) => Promise<{ removedTag: ProjectTag }> - Removes a tag from a project
 *
 *   // Editor
 *   fetchProjectLanguages: (id: string) => Promise<{ languages: Language[] }> - Fetches available languages for a project
 *   fetchProjectForEditor: (id: string) => Promise<{ project: Project }> - Fetches project data for the editor
 * }
 *
 * @example
 * ```ts
 * const { createProject, addTagToProject } = useProjectManagement()
 *
 * // Create a new project
 * const { createdProject } = await createProject({
 *   name: "My Project",
 *   description: "Project description"
 * })
 *
 * // Add a tag to the project
 * await addTagToProject(createdProject.id, tagId)
 * ```
 */

export function useProjectManagement() {
  const projectStore = useProjectStore();
  const currentEditedProjectStore = useCurrentEditedProjectStore();
  const { processProjectData } = useProjectData();

  /**
   * @function fetchProject
   *
   * @description Fetches a single project by its ID from the server.
   *
   * @param id - The unique identifier for the project
   *
   * @returns Promise containing the fetched project data
   *
   * @throws {Error} If the API request fails
   */
  const fetchProject = async (id: string) => {
    const project = await $fetch(`/api/projects/single/${id}`, {
      method: "GET",
    });

    return { project };
  };

  /**
   * @function createProject
   *
   * @description Creates a new project and updates the projects store.
   *
   * @param data - Project data to create
   * @param data.name - Project name
   * @param data.description - Project description (optional)
   * @param data.client - Client name (optional)
   *
   * @returns Promise containing the created project data
   *
   * @throws {Error} If the API request fails
   *
   * @sideEffect Updates the projects store with the new project
   */
  const createProject = async (data: Partial<Project>) => {
    const createdProject = await $fetch(`/api/projects/single`, {
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
   * @function updateProject
   *
   * @description Updates an existing project and updates the projects store.
   *
   * @param id - The unique identifier for the project to update
   * @param data - Updated project data
   * @param data.name - New project name (optional)
   * @param data.description - New project description (optional)
   * @param data.client - New client name (optional)
   *
   * @returns Promise containing the updated project data
   *
   * @throws {Error} If the API request fails
   *
   * @sideEffect Updates the projects store with the updated project
   */
  const updateProject = async (id: string, data: Partial<Project>) => {
    const updatedProject = await $fetch(`/api/projects/single/${id}`, {
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
   * @function deleteProject
   *
   * @description Deletes a project and removes it from the projects store.
   *
   * @param id - The unique identifier for the project to delete
   *
   * @returns Promise containing the deleted project data
   *
   * @throws {Error} If the API request fails
   *
   * @sideEffect Removes the project from the projects store
   */
  const deleteProject = async (id: string) => {
    const deletedProject = await $fetch(`/api/projects/single/${id}`, {
      method: "DELETE",
    });

    if (deletedProject) {
      // Update the projects store with deleted project
      projectStore.deleteProject(processProjectData(deletedProject.project));
    }

    return { deletedProject };
  };

  /**
   * @function fetchAllTags
   *
   * @description Fetches all tags available for the current user.
   *
   * @returns Promise containing an array of tags
   *
   * @throws {Error} If the API request fails
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
   * @function createTag
   *
   * @description Creates a new tag.
   *
   * @param name - The name for the new tag
   *
   * @returns Promise containing the created tag data
   *
   * @throws {Error} If the API request fails
   */
  const createTag = async (name: string) => {
    const newTag = await $fetch(`/api/projects/tags`, {
      method: "POST",
      body: { name },
    });

    return { newTag };
  };

  /**
   * @function deleteTag
   *
   * @description Deletes a tag.
   *
   * @param id - The unique identifier for the tag to delete
   *
   * @returns Promise containing the deleted tag data
   *
   * @throws {Error} If the API request fails
   */
  const deleteTag = async (id: string) => {
    const deletedTag = await $fetch(`/api/projects/tags/${id}`, {
      method: "DELETE",
    });

    return { deletedTag };
  };

  /**
   * @function addTagToProject
   *
   * @description Adds a tag to a project.
   *
   * @param projectId - The unique identifier for the project
   * @param tagId - The unique identifier for the tag to add
   *
   * @returns Promise containing the project tag association data
   *
   * @throws {Error} If the API request fails
   */
  const addTagToProject = async (projectId: string, tagId: string) => {
    const addedTag = await $fetch(`/api/projects/single/${projectId}/tags`, {
      method: "POST",
      body: { tagId },
    });

    return { addedTag };
  };

  /**
   * @function removeTagFromProject
   *
   * @description Removes a tag from a project.
   *
   * @param projectId - The unique identifier for the project
   * @param tagId - The unique identifier for the tag to remove
   *
   * @returns Promise containing the removal confirmation
   *
   * @throws {Error} If the API request fails
   */
  const removeTagFromProject = async (projectId: string, tagId: string) => {
    const removedTag = await $fetch(`/api/projects/single/${projectId}/tags/${tagId}`, {
      method: "DELETE",
    });

    return { removedTag };
  };

  /**
   * @function fetchProjectLanguages
   *
   * @description Fetches all available languages for a project.
   *
   * @param id - The unique identifier for the project
   *
   * @returns Promise containing an array of available languages
   *
   * @throws {Error} If the API request fails
   */
  const fetchProjectLanguages = async (id: string) => {
    const languages = await $fetch(`/api/projects/languages`, {
      method: "GET",
    });

    return { languages };
  };

  /**
   * @function fetchProjectForEditor
   *
   * @description Fetches project data specifically formatted for the editor interface.
   *
   * @param id - The unique identifier for the project
   *
   * @returns Promise containing the project data formatted for the editor
   *
   * @throws {Error} If the API request fails
   *
   * @sideEffect Updates the current edited project store with the fetched project
   */
  const fetchProjectForEditor = async (id: string) => {
    const project = await $fetch(`/api/projects/single/${id}/editor`, {
      method: "GET",
    });

    if (project) {
      // Update the current edited project store with the fetched project
      currentEditedProjectStore.setCurrentProject(processProjectData(project.project));
    }

    return { project };
  };

  return {
    // Project
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    // Tags
    fetchAllTags,
    createTag,
    deleteTag,
    addTagToProject,
    removeTagFromProject,
    // Editor
    fetchProjectLanguages,
    fetchProjectForEditor,
  };
}
