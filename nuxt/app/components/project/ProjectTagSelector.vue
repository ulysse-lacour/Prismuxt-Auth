<script setup lang="ts">
  /**
   * Project Tag Selector Component
   *
   * Allows users to view, add, and remove tags from a project
   * Provides functionality to create new tags if needed
   */

  import { Button } from "@/components/ui/button";
  import {
    Combobox,
    ComboboxAnchor,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
  } from "@/components/ui/combobox";
  import { cn } from "@/lib/utils";
  import { toast } from "~/components/ui/toast";
  import { Check, ChevronsUpDown, PlusCircle, Search, X } from "lucide-vue-next";
  import { computed, ref } from "vue";

  // Props
  const props = defineProps<{
    projectId: string;
  }>();

  const { fetchProject, fetchAllTags, removeTagFromProject, addTagToProject, createTag } =
    useProjectManagement();

  // Fetch project
  const { project } = await fetchProject(props.projectId);

  // Fetch all tags and store in a ref for reactivity
  const { allTags: fetchedTags } = await fetchAllTags();
  const allTags = ref(fetchedTags);

  // Create a list of tags that are already in the project
  const projectTags = ref(project.project?.tags || []);

  // UI state
  const isLoading = ref(false);
  const isRemoving = ref<string | null>(null);
  const open = ref(false);
  const selectedTag = ref<{ value: string; label: string } | null>(null);
  const searchInput = ref("");

  // Available tags for selection
  const availableTags = computed(() => {
    if (!allTags.value?.tags) return [];

    // Get tags that aren't already in the project
    return allTags.value.tags
      .filter((tag) => !projectTags.value.some((projectTag) => projectTag.id === tag.id))
      .map((tag) => ({
        value: tag.id,
        label: tag.name,
      }));
  });

  // Filtered tags based on search input
  const filteredTags = computed(() => {
    if (!searchInput.value) return availableTags.value;

    return availableTags.value.filter((tag) =>
      tag.label.toLowerCase().includes(searchInput.value.toLowerCase())
    );
  });

  // Check if search term exists in available tags
  const searchExists = computed(() => {
    if (!searchInput.value) return true;
    return availableTags.value.some(
      (tag) => tag.label.toLowerCase() === searchInput.value.toLowerCase()
    );
  });

  // Handle removing a tag from the project
  const handleRemoveTag = async (tagId: string) => {
    try {
      isRemoving.value = tagId;
      const { removedTag } = await removeTagFromProject(props.projectId, tagId);

      if (removedTag) {
        // Update local state
        projectTags.value = projectTags.value.filter((tag) => tag.id !== tagId);
        toast({
          title: "Success",
          description: "Tag removed from project",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove tag from project",
        variant: "destructive",
      });
    } finally {
      isRemoving.value = null;
    }
  };

  // Handle adding a tag to the project
  const handleAddTag = async () => {
    if (!selectedTag.value?.value) return;

    try {
      isLoading.value = true;
      const { addedTag } = await addTagToProject(props.projectId, selectedTag.value.value);

      if (addedTag) {
        // Refresh project data to get updated tags
        const { project: refreshedProject } = await fetchProject(props.projectId);
        projectTags.value = refreshedProject.project?.tags || [];

        // Reset selection
        selectedTag.value = null;
        searchInput.value = "";
        open.value = false;

        toast({
          title: "Success",
          description: "Tag added to project",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tag to project",
        variant: "destructive",
      });
    } finally {
      isLoading.value = false;
    }
  };

  // Handle creating a new tag
  const handleCreateTag = async () => {
    if (!searchInput.value) return;

    try {
      isLoading.value = true;
      const { newTag } = await createTag(searchInput.value);

      if (newTag?.tag) {
        // Add the new tag to allTags if it exists
        if (allTags.value?.tags) {
          allTags.value.tags.push(newTag.tag);
        }

        // Add the tag to the project
        await addTagToProject(props.projectId, newTag.tag.id);

        // Refresh project data to get updated tags
        const { project: refreshedProject } = await fetchProject(props.projectId);
        projectTags.value = refreshedProject.project?.tags || [];

        // Reset input
        searchInput.value = "";
        open.value = false;

        toast({
          title: "Success",
          description: "Tag created and added to project",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      });
    } finally {
      isLoading.value = false;
    }
  };

  // Handle tag selection
  const handleSelect = (value: string) => {
    selectedTag.value = availableTags.value.find((tag) => tag.value === value) || null;
    handleAddTag();
  };
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium">Project Tags</h3>

    <!-- Display current project tags -->
    <div v-if="projectTags.length > 0" class="flex flex-wrap gap-2">
      <div
        v-for="tag in projectTags"
        :key="tag.id"
        class="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-sm font-medium"
      >
        {{ tag.name }}
        <button
          class="ml-1 rounded-full p-0.5"
          aria-label="Remove tag"
          :disabled="isRemoving === tag.id"
          @click="handleRemoveTag(tag.id)"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
    <div v-else class="text-sm text-gray-500">No tags added to this project yet.</div>

    <!-- Add tag form -->
    <div class="mt-4 max-w-6xl">
      <h3 class="mb-2 text-lg font-medium">Add Tags</h3>

      <div class="flex flex-col gap-4">
        <!-- Tag selection dropdown -->
        <div class="flex items-end gap-2">
          <div class="flex-1">
            <Combobox v-model="selectedTag" v-model:open="open" by="value">
              <ComboboxAnchor as-child>
                <ComboboxTrigger as-child>
                  <Button variant="outline" class="w-full justify-between" :disabled="isLoading">
                    {{ selectedTag?.label ? selectedTag.label : "Select or create tag" }}
                    <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </ComboboxTrigger>
              </ComboboxAnchor>

              <ComboboxList
                position="popper"
                class="max-h-[300px] w-full min-w-[var(--reka-combobox-trigger-width)] overflow-y-auto data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
              >
                <!-- Search input for tags -->
                <div class="relative w-full items-center">
                  <ComboboxInput
                    v-model="searchInput"
                    class="h-10 rounded-none border-0 border-b pl-9 focus-visible:ring-0"
                    placeholder="Search or create tag..."
                  />
                  <span class="absolute inset-y-0 start-0 flex items-center justify-center px-3">
                    <Search class="size-4 text-muted-foreground" />
                  </span>
                </div>

                <ComboboxEmpty v-if="searchInput && !searchExists">
                  <div class="flex flex-col items-center py-2">
                    <span>No tag found</span>
                    <div class="flex items-center gap-1 text-sm text-muted-foreground">
                      Create "<span class="font-medium">{{ searchInput }}</span
                      >"?
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      class="mt-2"
                      :disabled="isLoading"
                      @click="handleCreateTag"
                    >
                      <span v-if="isLoading" class="mr-2 h-4 w-4 animate-spin">•</span>
                      <PlusCircle v-else class="mr-2 h-4 w-4" />
                      Create Tag
                    </Button>
                  </div>
                </ComboboxEmpty>

                <ComboboxEmpty v-else-if="filteredTags.length === 0">
                  No tags available
                </ComboboxEmpty>

                <ComboboxGroup>
                  <ComboboxItem
                    v-for="tag in filteredTags"
                    :key="tag.value"
                    :value="tag.value"
                    @select="handleSelect(tag.value)"
                  >
                    {{ tag.label }}
                    <Check
                      :class="
                        cn(
                          'ml-auto h-4 w-4',
                          selectedTag?.value === tag.value ? 'opacity-100' : 'opacity-0'
                        )
                      "
                    />
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
