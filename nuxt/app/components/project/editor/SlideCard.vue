<script lang="ts" setup>
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
  import type { ProjectContentBlock, SlideTag } from "@prisma/client";

  const props = defineProps<{
    slide: ProjectContentBlock & {
      slideTag?: SlideTag | null;
    };
    isActive?: boolean;
    rotate?: "horizontal" | "vertical";
  }>();

  const emit = defineEmits(["update:slide", "activate"]);

  // Get the current route to extract the project ID
  const route = useRoute();
  const projectId = route.params.id as string;

  // Use our project content block composable
  const { updateBlockLayout, fetchSlideTags, createSlideTag, updateSlideTag } =
    useProjectContentBlock();

  // State to track if layout options are visible
  const showLayoutOptions = ref(false);

  // State to track loading state during updates
  const isUpdating = ref(false);

  // State for tag selector
  const open = ref(false);
  const selectedTag = ref<{ value: string; label: string } | null>(null);
  const searchInput = ref("");
  const isLoadingTag = ref(false);

  // Create a computed property for two-way binding of the slide
  const modelValue = computed({
    get: () => props.slide,
    set: (value) => emit("update:slide", value),
  });

  // Fetch all slide tags for the current user
  const { data: slideTags } = await fetchSlideTags();

  // Available tags for selection
  const availableTags = computed(() => {
    if (!slideTags.value?.tags) return [];
    return slideTags.value.tags.map((tag) => ({
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

  // Handle slide activation
  const handleActivate = () => {
    emit("activate", props.slide.id);
  };

  // Toggle the visibility of layout options
  const toggleLayoutOptions = () => {
    showLayoutOptions.value = !showLayoutOptions.value;
  };

  // Handle layout selection
  const handleLayoutSelect = async (layoutType: "HEADER" | "TEXT" | "IMAGE" | "QUOTE") => {
    try {
      isUpdating.value = true;
      const response = await updateBlockLayout(projectId, props.slide.id, layoutType);

      if (response?.block) {
        // Update the slide through the computed property, preserving the existing slide structure
        modelValue.value = {
          ...props.slide,
          type: response.block.type,
          config: response.block.config,
          content: response.block.content,
        };

        showLayoutOptions.value = false;
        toast({
          title: "Layout updated",
          description: `Changed slide layout to ${layoutType.toLowerCase()}`,
        });
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update slide layout",
        variant: "destructive",
      });
      console.error("Error updating slide layout:", error);
    } finally {
      isUpdating.value = false;
    }
  };

  // Handle creating a new slide tag
  const handleCreateTag = async () => {
    if (!searchInput.value) return;

    try {
      isLoadingTag.value = true;
      const response = await createSlideTag(searchInput.value);

      if (response.tag) {
        // Add the new tag to slideTags
        if (slideTags.value?.tags) {
          slideTags.value.tags.push({
            ...response.tag,
            createdAt: new Date(response.tag.createdAt),
            updatedAt: new Date(response.tag.updatedAt),
          });
        }

        // Update the slide with the new tag
        const updateResponse = await handleUpdateSlideTag(response.tag.id);
        if (updateResponse?.block) {
          // Set the selected tag to match the newly created tag
          selectedTag.value = {
            value: response.tag.id,
            label: response.tag.name,
          };
        }
        // Reset input
        searchInput.value = "";
        open.value = false;

        toast({
          title: "Success",
          description: "Tag created and added to slide",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      });
    } finally {
      isLoadingTag.value = false;
    }
  };

  // Handle updating the slide's tag
  const handleUpdateSlideTag = async (tagId: string | null) => {
    try {
      isLoadingTag.value = true;
      const response = await updateSlideTag(projectId, props.slide.id, tagId);

      if (response.block) {
        emit("update:slide", response.block);
        // Reset selectedTag when removing a tag
        if (!tagId) {
          selectedTag.value = null;
        }
        return response;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update slide tag",
        variant: "destructive",
      });
    } finally {
      isLoadingTag.value = false;
    }
  };

  // Handle tag selection
  const handleSelect = (value: string) => {
    selectedTag.value = availableTags.value.find((tag) => tag.value === value) || null;
    if (selectedTag.value) {
      handleUpdateSlideTag(selectedTag.value.value);
    }
  };

  // Handle removing the tag
  const handleRemoveTag = () => {
    handleUpdateSlideTag(null);
    selectedTag.value = null; // Explicitly reset selectedTag
  };

  watch(
    () => props.isActive,
    (newValue, oldValue) => {
      if (oldValue === true && newValue === false) {
        showLayoutOptions.value = false;
        open.value = false; // Close the combobox when slide becomes inactive
      }
    }
  );

  // Handle slide update from SlidePreview
  const handleSlideUpdate = (updatedSlide: ProjectContentBlock) => {
    emit("update:slide", updatedSlide);
  };
</script>

<template>
  <div v-if="isActive" class="flex h-fit w-full flex-col rounded-lg bg-[#fff8ef] text-black">
    <div class="flex h-full w-full flex-col overflow-hidden rounded-lg outline outline-[#FFFB03]">
      <div class="bg-[#FFFB03] px-4 py-2 font-bold">Slide - {{ slide.order }}</div>
      <div class="space-y-4 p-4">
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

        <!-- Tag selector section -->
        <div class="mt-4 space-y-2 text-white">
          <!-- Display current tag if exists -->
          <div v-if="slide.slideTagId" class="flex items-center gap-2">
            <div
              class="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-sm font-medium"
            >
              {{ slideTags?.tags?.find((tag) => tag.id === slide.slideTagId)?.name }}
              <button
                class="ml-1 rounded-full p-0.5"
                aria-label="Remove tag"
                :disabled="isLoadingTag"
                @click="handleRemoveTag"
              >
                <X class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <!-- Tag selector combobox -->
          <div v-else class="flex items-end gap-2">
            <div class="flex-1">
              <Combobox v-model="selectedTag" v-model:open="open" by="value">
                <ComboboxAnchor as-child>
                  <ComboboxTrigger as-child>
                    <Button
                      variant="outline"
                      class="w-full justify-between"
                      :disabled="isLoadingTag"
                    >
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
                        :disabled="isLoadingTag"
                        @click="handleCreateTag"
                      >
                        <span v-if="isLoadingTag" class="mr-2 h-4 w-4 animate-spin">•</span>
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
  </div>

  <div v-else class="h-fit cursor-pointer" @click="handleActivate">
    <div class="relative rounded-lg border bg-white p-2">
      <!-- Thumbnail preview -->
      <div class="">
        <SlidePreview :slide="slide" :rotate="rotate" class="!p-0" @update="handleSlideUpdate" />
      </div>
    </div>
  </div>
</template>

<style>
  /* Add any component-specific styles here if needed */
</style>
