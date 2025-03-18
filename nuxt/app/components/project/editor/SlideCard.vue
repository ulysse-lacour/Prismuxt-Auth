<script lang="ts" setup>
  import { toast } from "~/components/ui/toast";
  import type { ProjectContentBlock } from "@prisma/client";

  const props = defineProps<{
    slide: ProjectContentBlock;
    isActive?: boolean;
  }>();

  const emit = defineEmits(["update:slide"]);

  // Get the current route to extract the project ID
  const route = useRoute();
  const projectId = route.params.id as string;

  // Use our project content block composable
  const { updateBlockLayout } = useProjectContentBlock();

  // State to track if layout options are visible
  const showLayoutOptions = ref(false);

  // State to track loading state during updates
  const isUpdating = ref(false);

  // Toggle the visibility of layout options
  const toggleLayoutOptions = () => {
    showLayoutOptions.value = !showLayoutOptions.value;
  };

  // Handle layout selection
  const handleLayoutSelect = async (layoutType: "HEADER" | "TEXT" | "IMAGE" | "QUOTE") => {
    try {
      // Set loading state
      isUpdating.value = true;

      // Update the block layout
      const response = await updateBlockLayout(projectId, props.slide.id, layoutType);

      // Emit updated slide data
      emit("update:slide", response.block);

      // Close the layout options
      showLayoutOptions.value = false;

      // Show success notification using the global toast
      toast({
        title: "Layout updated",
        description: `Changed slide layout to ${layoutType.toLowerCase()}`,
      });
    } catch (error) {
      // Show error notification using the global toast
      toast({
        title: "Update failed",
        description: "Failed to update slide layout",
        variant: "destructive",
      });
      console.error("Error updating slide layout:", error);
    } finally {
      // Reset loading state
      isUpdating.value = false;
    }
  };

  watch(
    () => props.isActive,
    (newValue, oldValue) => {
      // If this slide has just become active and layout options were open,
      // we don't need to do anything

      // But if this slide was active and is now inactive, close the options
      if (oldValue === true && newValue === false) {
        showLayoutOptions.value = false;
      }
    }
  );
</script>

<template>
  <div
    v-if="isActive"
    class="flex h-fit w-2/12 min-w-[300px] flex-col overflow-hidden rounded-lg bg-[#fff8ef] text-black"
  >
    <!-- Yellow header -->
    <div class="bg-[#FFFB03] px-4 py-2 font-bold">Slide - {{ slide.order }}</div>
    <div class="space-y-2 p-4">
      <!-- Change Slide Layout button with toggle arrow -->
      <button
        @click="toggleLayoutOptions"
        class="flex w-full items-center justify-start rounded-full bg-[#C5C5C5] px-4 py-2 text-left transition duration-150 hover:bg-[#b8b8b8]"
        :disabled="isUpdating"
      >
        <span>Change Slide Layout</span>
      </button>

      <!-- Layout options with transition -->
      <div
        class="flex flex-col gap-2 overflow-hidden transition-all duration-300 ease-in-out"
        :class="showLayoutOptions ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
      >
        <button
          @click="handleLayoutSelect('HEADER')"
          class="cursor-pointer rounded-md px-3 py-2 text-left transition hover:bg-gray-200"
          :disabled="isUpdating"
        >
          Header
        </button>
        <button
          @click="handleLayoutSelect('TEXT')"
          class="cursor-pointer rounded-md px-3 py-2 text-left transition hover:bg-gray-200"
          :disabled="isUpdating"
        >
          Text
        </button>
        <button
          @click="handleLayoutSelect('IMAGE')"
          class="cursor-pointer rounded-md px-3 py-2 text-left transition hover:bg-gray-200"
          :disabled="isUpdating"
        >
          Image
        </button>
        <button
          @click="handleLayoutSelect('QUOTE')"
          class="cursor-pointer rounded-md px-3 py-2 text-left transition hover:bg-gray-200"
          :disabled="isUpdating"
        >
          Quote
        </button>
      </div>
    </div>
  </div>

  <div v-else class="h-fit w-2/12 min-w-[300px]">
    <div class="px-4 py-2">Slide - {{ slide.order }}</div>
  </div>
</template>

<style>
  /* Add any component-specific styles here if needed */
</style>
