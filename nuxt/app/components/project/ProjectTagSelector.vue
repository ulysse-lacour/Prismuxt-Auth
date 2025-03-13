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

  const { fetchProject, fetchAllTags } = useProjectManagement();

  // Fetch project
  const { project } = await fetchProject(props.projectId);

  // Fetch all tags
  const { allTags } = await fetchAllTags();

  // Create a list of tags that are already in the project
  const projectTags = project.value?.project?.tags;

  // Create a list of tags that are not already in the project
  const availableTags = allTags.value?.tags.filter(
    (tag) => !projectTags?.some((projectTag) => projectTag.name === tag.name)
  );

  console.log(availableTags);
  console.log(projectTags);
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium">Project Tags</h3>

    <div class="flex flex-wrap gap-2" v-if="project?.project?.tags">
      <div
        v-for="tag in projectTags"
        :key="tag.id"
        class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
      >
        {{ tag.name }}
      </div>
    </div>

    <h3 class="text-lg font-medium">Choosable Tags</h3>

    <div class="flex flex-wrap gap-2" v-if="allTags">
      <div
        v-for="tag in availableTags"
        :key="tag.id"
        class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
      >
        {{ tag.name }}
      </div>
    </div>

    <h3 class="text-lg font-medium">Available Tags</h3>

    <div class="flex flex-wrap gap-2" v-if="allTags">
      <div
        v-for="tag in allTags.tags"
        :key="tag.id"
        class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
      >
        {{ tag.name }}
      </div>
    </div>
  </div>
</template>
