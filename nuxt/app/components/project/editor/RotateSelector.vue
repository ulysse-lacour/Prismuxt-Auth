<script setup lang="ts">
  const rotate = ref("horizontal");

  const toggleRotate = (direction: "horizontal" | "vertical") => {
    console.log("Toggle rotate", direction);
    rotate.value = direction;
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
        :stroke="rotate === 'horizontal' ? 'white' : '#6b7280'"
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
        :stroke="rotate === 'vertical' ? 'white' : '#6b7280'"
        stroke-width="2"
      />
    </svg>
  </div>
</template>
