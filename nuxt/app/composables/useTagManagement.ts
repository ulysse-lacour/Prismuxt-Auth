/**
 * Tag Management Composable
 *
 * Provides functionality for managing tags in the application
 * - Fetching user's tags
 * - Creating new tags
 * - Assigning tags to projects
 * - Removing tags from projects
 */

interface Tag {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function useTagManagement() {
  // State
  const userTags = ref<Tag[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch all tags for the current user
   */
  const fetchUserTags = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch("/api/tags");
      userTags.value = response.tags;
      return response.tags;
    } catch (err: any) {
      console.error("Error fetching tags:", err);
      error.value = err.message || "Failed to fetch tags";
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Create a new tag
   */
  const createTag = async (name: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch("/api/tags", {
        method: "POST",
        body: { name },
      });

      // Add the new tag to the local state
      userTags.value.push(response.tag);
      return response.tag;
    } catch (err: any) {
      console.error("Error creating tag:", err);
      error.value = err.message || "Failed to create tag";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch tags for a specific project
   */
  const fetchProjectTags = async (projectId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/projects/${projectId}/tags`);
      return response.tags;
    } catch (err: any) {
      console.error("Error fetching project tags:", err);
      error.value = err.message || "Failed to fetch project tags";
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Add a tag to a project
   */
  const addTagToProject = async (projectId: string, tagId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/projects/${projectId}/tags`, {
        method: "POST",
        body: { tagId },
      });
      return response.projectTag;
    } catch (err: any) {
      console.error("Error adding tag to project:", err);
      error.value = err.message || "Failed to add tag to project";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Remove a tag from a project
   */
  const removeTagFromProject = async (projectId: string, tagId: string) => {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/projects/${projectId}/tags/${tagId}`, {
        method: "DELETE",
      });
      return true;
    } catch (err: any) {
      console.error("Error removing tag from project:", err);
      error.value = err.message || "Failed to remove tag from project";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    userTags,
    isLoading,
    error,
    fetchUserTags,
    createTag,
    fetchProjectTags,
    addTagToProject,
    removeTagFromProject,
  };
}
