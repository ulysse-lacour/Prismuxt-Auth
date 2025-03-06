<script setup lang="ts"></script>

<template>
  <div class="app">
    <Html>
      <Body>
        <NuxtLayout>
          <NuxtLoadingIndicator />
          <NuxtPage />
          <Toaster />
        </NuxtLayout>
      </Body>
    </Html>
  </div>
</template>
