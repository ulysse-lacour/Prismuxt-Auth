<script setup lang="ts">
  /**
   * Sign In Page
   *
   * Provides a form for users to sign in to their account
   * Handles authentication and error display
   */
  import { signIn } from "~/utils/auth-client";

  // Define page metadata
  definePageMeta({
    layout: "default",
  });

  // Form state
  const email = ref("");
  const password = ref("");
  const isErrorDialogOpen = ref(false);
  const errorMessage = ref("");

  /**
   * Handle sign in form submission
   * Attempts to authenticate the user with provided credentials
   */
  const handleSignIn = async () => {
    await signIn.email(
      {
        email: email.value,
        password: password.value,
        callbackURL: "/dashboard",
      },
      {
        onError(context) {
          errorMessage.value = context.error.message;
          isErrorDialogOpen.value = true;
        },
      }
    );
  };
</script>

<template>
  <!-- Using FormCard component for consistent layout -->
  <FormCard title="Login" description="Enter your email below to login to your account">
    <div class="grid gap-4">
      <!-- Email input field -->
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
      </div>

      <!-- Using PasswordInput component -->
      <PasswordInput v-model="password" forgot-password-link placeholder="password" />

      <!-- Submit button -->
      <Button type="submit" class="w-full" @click="handleSignIn">Login</Button>

      <!-- Sign up link -->
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <NuxtLink to="/auth/sign-up" class="underline">Sign up</NuxtLink>
      </div>
    </div>

    <!-- Using ErrorDialog component -->
    <ErrorDialog v-model:open="isErrorDialogOpen" :message="errorMessage" />
  </FormCard>
</template>
