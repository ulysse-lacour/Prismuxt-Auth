<script lang="ts" setup>
  import type { ProjectContentBlock } from "@prisma/client";

  const props = defineProps<{
    slide: ProjectContentBlock;
    isActive?: boolean;
  }>();

  // State to track if layout options are visible
  const showLayoutOptions = ref(false);

  // Toggle the visibility of layout options
  const toggleLayoutOptions = () => {
    showLayoutOptions.value = !showLayoutOptions.value;
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
      >
        <span>Change Slide Layout</span>
      </button>

      <!-- Layout options with transition -->
      <div
        class="flex flex-col gap-2 overflow-hidden transition-all duration-300 ease-in-out"
        :class="showLayoutOptions ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
      >
        <div class="cursor-pointer rounded-md px-3 py-2 transition hover:bg-gray-200">Layout 1</div>
        <div class="cursor-pointer rounded-md px-3 py-2 transition hover:bg-gray-200">Header</div>
        <div class="cursor-pointer rounded-md px-3 py-2 transition hover:bg-gray-200">Text</div>
        <div class="cursor-pointer rounded-md px-3 py-2 transition hover:bg-gray-200">Image</div>
        <div class="cursor-pointer rounded-md px-3 py-2 transition hover:bg-gray-200">Quote</div>
      </div>
    </div>
  </div>

  <div v-else class="h-fit w-2/12 min-w-[300px]">
    <div class="px-4 py-2">Slide - {{ slide.order }}</div>
  </div>
</template>

<style>
  /* You can add any additional custom styles here if needed */
</style>
