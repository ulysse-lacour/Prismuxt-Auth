import type { SlideTag } from "@prisma/client";

/**
 * Composable for managing project content blocks
 * Provides functions for updating and managing blocks
 */
export const useProjectContentBlock = () => {
  /**
   * Updates a specific project content block
   * @param projectId - The ID of the project that contains the block
   * @param blockId - The ID of the block to update
   * @param updateData - Object containing the fields to update (type, config, content)
   * @returns The response from the API with the updated block
   */
  const updateContentBlock = async (
    projectId: string,
    blockId: string,
    updateData: {
      type?: "HEADER" | "TEXT" | "IMAGE" | "QUOTE";
      config?: Record<string, any>;
      content?: Record<string, any>;
    }
  ) => {
    const response = await $fetch(`/api/project/${projectId}/block/update`, {
      method: "PUT",
      body: {
        blockId,
        ...updateData,
      },
    });

    return response;
  };

  /**
   * Creates a new content block for a project content
   * @param projectId - The ID of the project
   * @param contentId - The ID of the project content to add the block to
   * @param blockData - Optional data for the new block (type, order, config, content)
   * @returns The response from the API with the created block
   */
  const createContentBlock = async (
    projectId: string,
    contentId: string,
    blockData?: {
      type?: "HEADER" | "TEXT" | "IMAGE" | "QUOTE";
      order?: number;
      config?: Record<string, any>;
      content?: Record<string, any>;
    }
  ) => {
    const response = await $fetch(`/api/project/${projectId}/block/create`, {
      method: "POST",
      body: {
        contentId,
        ...blockData,
      },
    });

    return response;
  };

  /**
   * Updates the layout type of a content block
   * @param projectId - The ID of the project
   * @param blockId - The ID of the block to update
   * @param layoutType - The new layout type
   * @returns The response from the API
   */
  const updateBlockLayout = async (
    projectId: string,
    blockId: string,
    layoutType: "HEADER" | "TEXT" | "IMAGE" | "QUOTE"
  ) => {
    // Set default configurations based on layout type
    let config = {};
    let content = {};

    switch (layoutType) {
      case "HEADER":
        config = { align: "center", size: "large" };
        content = { text: "New Header" };
        break;
      case "TEXT":
        config = { align: "left" };
        content = { text: "New text content" };
        break;
      case "IMAGE":
        config = { width: "full", height: "auto" };
        content = { src: "", alt: "Image description" };
        break;
      case "QUOTE":
        config = { style: "modern" };
        content = { text: "New quote text", author: "Author name" };
        break;
    }

    return updateContentBlock(projectId, blockId, {
      type: layoutType,
      config,
      content,
    });
  };

  /**
   * Fetches all slide tags for the current user
   * @returns The response from the API with the list of tags
   */
  const fetchSlideTags = async () => {
    const response = await useFetch<{ tags: SlideTag[] }>(`/api/slide-tags`);
    return response;
  };

  /**
   * Creates a new slide tag
   * @param name - The name of the tag to create
   * @returns The response from the API with the created tag
   */
  const createSlideTag = async (name: string) => {
    const response = await $fetch(`/api/slide-tags/create`, {
      method: "POST",
      body: { name },
    });
    return response;
  };

  /**
   * Updates a slide's tag
   * @param projectId - The ID of the project that contains the slide
   * @param blockId - The ID of the slide to update
   * @param tagId - The ID of the tag to assign, or null to remove the tag
   * @returns The response from the API with the updated block
   */
  const updateSlideTag = async (projectId: string, blockId: string, tagId: string | null) => {
    const response = await $fetch(`/api/project/${projectId}/block/${blockId}/tag`, {
      method: "PUT",
      body: { tagId },
    });
    return response;
  };

  return {
    updateContentBlock,
    createContentBlock,
    updateBlockLayout,
    fetchSlideTags,
    createSlideTag,
    updateSlideTag,
  };
};
