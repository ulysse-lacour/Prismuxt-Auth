<script setup lang="ts">
  const error = useError();

  console.error(error.value);

  const errorCode = !error.value ? 500 : error.value.statusCode;

  // const errorMessage = !error.value ? 'Something went wrong' : error.value.statusMessage;

  const handleError = () => {
    clearError({ redirect: "/" });
  };
</script>

<template>
  <NuxtLayout>
    <div id="error-page" :class="`error-${errorCode}`" role="alert" aria-labelledby="error-title">
      <p id="error-title" class="text-2xl font-bold">
        {{ $t(`error.error_${errorCode}`) }}
      </p>
      <div class="error-code">
        <h1>{{ errorCode }}</h1>
      </div>
      <NuxtLink to="/" class="font-bold" @click="handleError">
        {{ $t("common.home") }}
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<style>
  body:has(#error-page) #burger {
    display: none !important;
  }
</style>
