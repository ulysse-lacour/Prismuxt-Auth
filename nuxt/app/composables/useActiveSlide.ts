/**
 * Composable to track the most visible slide
 * Uses intersection observation data to determine which slide has the greatest visibility
 */
export const useActiveSlide = () => {
  // Store the current intersection data for each slide
  const intersectionData = ref<Map<string, number>>(new Map());

  // The currently active slide ID
  const activeSlideId = ref<string | null>(null);

  // Track if the active slide was set manually (by clicking)
  const isManuallyActivated = ref(false);

  // Handle intersection updates from slides
  const handleIntersection = ({ id, ratio }: { id: string; ratio: number }) => {
    // Update the intersection data for this slide
    intersectionData.value.set(id, ratio);

    // If current active slide has scrolled out of view (ratio 0),
    // we should allow auto-activation again
    if (activeSlideId.value && intersectionData.value.get(activeSlideId.value) === 0) {
      isManuallyActivated.value = false;
    }

    // Only auto-update if not manually activated
    if (!isManuallyActivated.value) {
      // Find the slide with the highest intersection ratio
      let highestRatio = 0;
      let mostVisibleId: string | null = null;

      intersectionData.value.forEach((ratio, slideId) => {
        if (ratio > highestRatio) {
          highestRatio = ratio;
          mostVisibleId = slideId;
        }
      });

      // Update the active slide if it has changed
      if (mostVisibleId && mostVisibleId !== activeSlideId.value) {
        activeSlideId.value = mostVisibleId;
      }

      // If nothing is visible, clear the active slide
      if (highestRatio === 0) {
        activeSlideId.value = null;
      }
    }
  };

  // Check if a specific slide is the active one
  const isSlideActive = (slideId: string) => {
    return activeSlideId.value === slideId;
  };

  // Manually set a slide as active
  const setActiveSlide = (slideId: string) => {
    activeSlideId.value = slideId;
    isManuallyActivated.value = true;
  };

  // Reset the active slide state when content changes (i.e., language switch)
  const resetActiveSlide = () => {
    intersectionData.value = new Map();
    activeSlideId.value = null;
    isManuallyActivated.value = false;
  };

  return {
    handleIntersection,
    isSlideActive,
    activeSlideId,
    setActiveSlide,
    resetActiveSlide,
  };
};
