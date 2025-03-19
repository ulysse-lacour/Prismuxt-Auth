import type { SlideTag } from "@prisma/client";

/**
 * @composable
 *
 * @description A composable for managing project content blocks, providing functions for creating,
 * updating, and managing content blocks and their associated slide tags.
 *
 * @returns {
 *   updateContentBlock: (projectId: string, blockId: string, updateData: {
 *     type?: "HEADER" | "TEXT" | "IMAGE" | "QUOTE",
 *     config?: Record<string, any>,
 *     content?: Record<string, any>
 *   }) => Promise<any> - Updates a specific content block
 *   createContentBlock: (projectId: string, contentId: string, blockData?: {
 *     type?: "HEADER" | "TEXT" | "IMAGE" | "QUOTE",
 *     order?: number,
 *     config?: Record<string, any>,
 *     content?: Record<string, any>
 *   }) => Promise<any> - Creates a new content block
 *   updateBlockLayout: (projectId: string, blockId: string, layoutType: "HEADER" | "TEXT" | "IMAGE" | "QUOTE") => Promise<any> - Updates block layout type
 *   fetchSlideTags: () => Promise<{ tags: SlideTag[] }> - Fetches all slide tags
 *   createSlideTag: (name: string) => Promise<any> - Creates a new slide tag
 *   updateSlideTag: (projectId: string, blockId: string, tagId: string | null) => Promise<any> - Updates a slide's tag
 * }
 *
 * @example
 * ```ts
 * const { updateContentBlock, createContentBlock } = useProjectContentBlock()
 *
 * // Update a content block
 * await updateContentBlock(projectId, blockId, {
 *   type: "TEXT",
 *   content: { text: "New content" }
 * })
 *
 * // Create a new content block
 * await createContentBlock(projectId, contentId, {
 *   type: "HEADER",
 *   content: { text: "New header" }
 * })
 * ```
 */

export const useProjectContentBlock = () => {
  /**
   * @function updateContentBlock
   *
   * @description Updates a specific project content block with new type, configuration, or content.
   *
   * @param projectId - The ID of the project containing the block
   * @param blockId - The ID of the block to update
   * @param updateData - Object containing the fields to update
   * @param updateData.type - New block type (optional)
   * @param updateData.config - New configuration options (optional)
   * @param updateData.content - New content options (optional)
   *
   * @returns Promise containing the updated block data
   *
   * @throws {Error} If the API request fails
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
    const response = await $fetch(`/api/projects/single/${projectId}/block/update`, {
      method: "PUT",
      body: {
        blockId,
        ...updateData,
      },
    });

    return response;
  };

  /**
   * @function createContentBlock
   *
   * @description Creates a new content block for a project content section.
   *
   * @param projectId - The ID of the project
   * @param contentId - The ID of the project content to add the block to
   * @param blockData - Optional data for the new block
   * @param blockData.type - Block type (defaults to "TEXT")
   * @param blockData.order - Display order (auto-calculated if not provided)
   * @param blockData.config - Block configuration options
   * @param blockData.content - Block content options
   *
   * @returns Promise containing the created block data
   *
   * @throws {Error} If the API request fails
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
    const response = await $fetch(`/api/projects/single/${projectId}/block/create`, {
      method: "POST",
      body: {
        contentId,
        ...blockData,
      },
    });

    return response;
  };

  /**
   * @function updateBlockLayout
   *
   * @description Updates the layout type of a content block with default configurations.
   *
   * @param projectId - The ID of the project
   * @param blockId - The ID of the block to update
   * @param layoutType - The new layout type
   *
   * @returns Promise containing the updated block data
   *
   * @throws {Error} If the API request fails
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
   * @function fetchSlideTags
   *
   * @description Fetches all slide tags for the current user.
   *
   * @returns Promise containing an array of slide tags
   *
   * @throws {Error} If the API request fails
   */
  const fetchSlideTags = async () => {
    const response = await useFetch<{ tags: SlideTag[] }>(`/api/projects/slide-tags`, {
      method: "GET",
    });
    return response;
  };

  /**
   * @function createSlideTag
   *
   * @description Creates a new slide tag.
   *
   * @param name - The name of the tag to create
   *
   * @returns Promise containing the created tag data
   *
   * @throws {Error} If the API request fails
   */
  const createSlideTag = async (name: string) => {
    const response = await $fetch(`/api/projects/slide-tags/create`, {
      method: "POST",
      body: { name },
    });
    return response;
  };

  /**
   * @function updateSlideTag
   *
   * @description Updates a slide's tag assignment.
   *
   * @param projectId - The ID of the project containing the slide
   * @param blockId - The ID of the slide to update
   * @param tagId - The ID of the tag to assign, or null to remove the tag
   *
   * @returns Promise containing the updated block data
   *
   * @throws {Error} If the API request fails
   */
  const updateSlideTag = async (projectId: string, blockId: string, tagId: string | null) => {
    const response = await $fetch(`/api/projects/single/${projectId}/block/${blockId}/slide-tag`, {
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
