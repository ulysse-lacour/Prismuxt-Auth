<script setup lang="ts">
  // In Nuxt 3, auto-imports are available but the linter might not recognize them
  // If needed, you can also add explicit imports:
  // import { ref } from 'vue'

  // Define the rotation type
  type RotateDirection = "horizontal" | "vertical";

  // Define props
  const props = defineProps<{
    rotate?: RotateDirection;
  }>();

  // Define emits
  const emit = defineEmits<{
    "update:rotate": [value: RotateDirection];
  }>();

  // Watch for prop changes to sync with internal state
  const direction = computed({
    get: () => props.rotate || "horizontal",
    set: (value: RotateDirection) => {
      emit("update:rotate", value);
    },
  });

  // Toggle rotation function
  const toggleRotate = (newDirection: RotateDirection) => {
    direction.value = newDirection;
  };
</script>

<template>
  <div class="flex items-end gap-2">
    <svg
      id="horizontal-rotate"
      class="cursor-pointer"
      width="30"
      height="17"
      viewBox="0 0 30 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="toggleRotate('horizontal')"
    >
      <rect
        x="1"
        y="1"
        width="28"
        height="15"
        rx="1"
        fill="black"
        :stroke="direction === 'horizontal' ? 'white' : '#6b7280'"
        stroke-width="2"
      />
    </svg>
    <svg
      id="vertical-rotate"
      class="cursor-pointer"
      width="17"
      height="30"
      viewBox="0 0 17 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="toggleRotate('vertical')"
    >
      <rect
        x="16"
        y="1"
        width="28"
        height="15"
        rx="1"
        transform="rotate(90 16 1)"
        fill="black"
        :stroke="direction === 'vertical' ? 'white' : '#6b7280'"
        stroke-width="2"
      />
    </svg>
  </div>
</template>
