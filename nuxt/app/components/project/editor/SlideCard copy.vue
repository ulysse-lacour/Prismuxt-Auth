<script lang="ts" setup>
  import { useToggle } from "@vueuse/core";
  import type { ProjectContentBlock } from "@prisma/client";

  const props = defineProps<{
    slide: ProjectContentBlock;
    isActive?: boolean;
  }>();

  // Track if category section is expanded
  const [showCategory, toggleCategoryRaw] = useToggle(false);

  // Create a wrapper for the toggle function that takes a MouseEvent
  const toggleCategory = (event: MouseEvent) => {
    toggleCategoryRaw();
  };

  // Track the selected category
  const selectedCategory = ref("Logo Design");

  // Available categories
  const categories = ref(["Logo Design", "Header", "Text", "Image", "Video", "Quote", "List"]);

  // Emit event when category is selected
  const emit = defineEmits(["select-category", "change-layout"]);

  // Handle category selection
  const selectCategory = (category: string) => {
    selectedCategory.value = category;
    showCategory.value = false;
    emit("select-category", category);
  };

  // Handle layout change
  const changeLayout = () => {
    emit("change-layout");
  };
</script>

<template>
  <!-- Active state: Full card with options -->
  <div
    v-if="isActive"
    class="flex h-fit min-w-[300px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-[#fff8ef] text-black shadow-md"
  >
    <!-- Yellow header -->
    <div class="bg-[#FFFD74] px-4 py-2 font-bold">Slide - {{ slide.order }}</div>

    <!-- Content area -->
    <div class="space-y-2 p-4">
      <!-- Category section -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-gray-800">Category</span>
          <button
            class="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 font-bold hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <!-- Category dropdown -->
        <div class="relative">
          <!-- Selected category display -->
          <button
            @click="toggleCategory"
            class="flex w-full items-center justify-between rounded-lg bg-[#d9d0d0] px-4 py-2 text-left transition hover:bg-[#c9c0c0]"
          >
            <span>{{ selectedCategory }}</span>
            <svg
              class="h-5 w-5 transition-transform duration-200"
              :class="showCategory ? 'rotate-180' : ''"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="showCategory"
            class="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <div
              v-for="category in categories"
              :key="category"
              @click="selectCategory(category)"
              class="cursor-pointer px-4 py-2 hover:bg-gray-100"
              :class="{ 'bg-yellow-50 font-medium': category === selectedCategory }"
            >
              {{ category }}
            </div>
          </div>
        </div>
      </div>

      <!-- Change Slide Layout button -->
      <button
        @click="changeLayout"
        class="w-full rounded-lg bg-[#d9d0d0] px-4 py-2 text-left transition hover:bg-[#c9c0c0]"
      >
        Change Slide Layout
      </button>
    </div>
  </div>

  <!-- Inactive state: Simple slide indicator -->
  <div v-else class="rounded bg-[#FFFD74] px-3 py-2 font-medium">Slide - {{ slide.order }}</div>
</template>

<style>
  /* You can add any additional custom styles here if needed */
</style>
