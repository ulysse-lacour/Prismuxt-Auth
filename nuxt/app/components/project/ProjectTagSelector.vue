<script setup lang="ts">
  /**
   * Project Tag Selector Component
   *
   * Allows users to view, add, and remove tags from a project
   * Provides functionality to create new tags if needed
   */

  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { toast } from "~/components/ui/toast";
  import { PlusCircle, X } from "lucide-vue-next";

  // Props
  const props = defineProps<{
    projectId: string;
  }>();

  // Composables
  const {
    userTags,
    isLoading,
    fetchUserTags,
    createTag,
    fetchProjectTags,
    addTagToProject,
    removeTagFromProject,
  } = useTagManagement();

  // Local state
  const projectTags = ref<any[]>([]);
  const newTagName = ref("");
  const isCreatingTag = ref(false);
  const isAddingExistingTag = ref(false);
  const selectedTagId = ref("");

  // Fetch data on component mount
  onMounted(async () => {
    await fetchUserTags();
    await loadProjectTags();
  });

  // Load project tags
  const loadProjectTags = async () => {
    try {
      projectTags.value = await fetchProjectTags(props.projectId);
    } catch (error) {
      console.error("Failed to load project tags:", error);
      toast({
        title: "Error",
        description: "Failed to load project tags",
        variant: "destructive",
      });
    }
  };

  // Get available tags (tags not already assigned to the project)
  const availableTags = computed(() => {
    const projectTagIds = projectTags.value.map((tag) => tag.id);
    return userTags.value.filter((tag) => !projectTagIds.includes(tag.id));
  });

  // Handle creating a new tag
  const handleCreateTag = async () => {
    if (!newTagName.value.trim()) return;

    isCreatingTag.value = true;
    try {
      const tag = await createTag(newTagName.value.trim());
      newTagName.value = "";
      toast({
        title: "Tag created",
        description: `Tag "${tag.name}" created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      });
    } finally {
      isCreatingTag.value = false;
    }
  };

  // Handle adding an existing tag to the project
  const handleAddTag = async () => {
    if (!selectedTagId.value) return;

    isAddingExistingTag.value = true;
    try {
      await addTagToProject(props.projectId, selectedTagId.value);
      await loadProjectTags();
      selectedTagId.value = "";
      toast({
        title: "Tag added",
        description: "Tag added to project successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tag to project",
        variant: "destructive",
      });
    } finally {
      isAddingExistingTag.value = false;
    }
  };

  // Handle removing a tag from the project
  const handleRemoveTag = async (tagId: string) => {
    try {
      await removeTagFromProject(props.projectId, tagId);
      await loadProjectTags();
      toast({
        title: "Tag removed",
        description: "Tag removed from project successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove tag from project",
        variant: "destructive",
      });
    }
  };
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium">Project Tags</h3>

    <!-- Current project tags -->
    <div v-if="projectTags.length > 0" class="flex flex-wrap gap-2">
      <div
        v-for="tag in projectTags"
        :key="tag.id"
        class="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
      >
        <span>{{ tag.name }}</span>
        <button
          @click="handleRemoveTag(tag.id)"
          class="ml-1 rounded-full p-0.5 hover:bg-primary/20"
          title="Remove tag"
        >
          <X class="h-3 w-3" />
        </button>
      </div>
    </div>
    <p v-else class="text-sm text-muted-foreground">No tags assigned to this project yet.</p>

    <!-- Create new tag form -->
    <div class="space-y-2">
      <h4 class="text-sm font-medium">Create New Tag</h4>
      <div class="flex gap-2">
        <Input
          v-model="newTagName"
          placeholder="Enter tag name"
          class="flex-1"
          :disabled="isCreatingTag"
          @keyup.enter="handleCreateTag"
        />
        <Button @click="handleCreateTag" :disabled="!newTagName.trim() || isCreatingTag" size="sm">
          <PlusCircle class="mr-1 h-4 w-4" />
          Create
        </Button>
      </div>
    </div>

    <!-- Add existing tag form -->
    <div v-if="availableTags.length > 0" class="space-y-2">
      <h4 class="text-sm font-medium">Add Existing Tag</h4>
      <div class="flex gap-2">
        <select
          v-model="selectedTagId"
          class="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          :disabled="isAddingExistingTag"
        >
          <option value="" disabled>Select a tag</option>
          <option v-for="tag in availableTags" :key="tag.id" :value="tag.id">
            {{ tag.name }}
          </option>
        </select>
        <Button @click="handleAddTag" :disabled="!selectedTagId || isAddingExistingTag" size="sm">
          Add
        </Button>
      </div>
    </div>
  </div>
</template>
