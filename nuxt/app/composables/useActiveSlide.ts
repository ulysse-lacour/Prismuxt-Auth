/**
 * Composable to track the most visible slide
 * Uses intersection observation data to determine which slide has the greatest visibility
 */
export const useActiveSlide = () => {
  // Store the current intersection data for each slide
  const intersectionData = ref<Map<string, number>>(new Map());

  // The currently active slide ID
  const activeSlideId = ref<string | null>(null);

  // Handle intersection updates from slides
  const handleIntersection = ({ id, ratio }: { id: string; ratio: number }) => {
    // Update the intersection data for this slide
    intersectionData.value.set(id, ratio);

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
  };

  // Check if a specific slide is the active one
  const isSlideActive = (slideId: string) => {
    return activeSlideId.value === slideId;
  };

  return {
    handleIntersection,
    isSlideActive,
    activeSlideId,
  };
};
