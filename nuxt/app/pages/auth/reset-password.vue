<script setup lang="ts">
  /**
   * Reset Password Page
   *
   * Provides a form for users to set a new password after requesting a reset
   * Validates password input and handles the reset process
   */
  import { resetPassword } from "~/utils/auth-client";

  // Define page metadata
  definePageMeta({
    layout: "default",
  });

  // Form state
  const confirmPassword = ref("");
  const password = ref("");
  const isErrorDialogOpen = ref(false);
  const errorMessage = ref("");

  /**
   * Handle reset password form submission
   * Validates passwords and processes the reset request
   */
  const handleResetPassword = async () => {
    // Validate password match
    if (confirmPassword.value !== password.value) {
      errorMessage.value = "Please enter same passwords";
      isErrorDialogOpen.value = true;
      return;
    }

    // Extract token from URL
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      errorMessage.value = "Invalid token, contact support";
      isErrorDialogOpen.value = true;
      return;
    }

    // Process password reset
    await resetPassword({
      newPassword: password.value,
      token: token,
      fetchOptions: {
        onSuccess(context) {
          // Redirect to sign-in page on success
          window.location.href = "/auth/sign-in";
        },
        onError(context) {
          // Show error message
          errorMessage.value = "Something went wrong, contact support.";
          isErrorDialogOpen.value = true;
        },
      },
    });
  };
</script>

<template>
  <!-- Using FormCard component for consistent layout -->
  <FormCard title="Reset Password" description="Enter your new password below">
    <div class="grid gap-4">
      <!-- New password field with show/hide toggle -->
      <div class="grid gap-2">
        <Label for="password">New Password</Label>
        <PasswordInput id="password" v-model="password" placeholder="New Password" noLabel />
      </div>

      <!-- Confirm password field with show/hide toggle -->
      <div class="grid gap-2">
        <Label for="confirm-password">Confirm Password</Label>
        <PasswordInput
          id="confirm-password"
          v-model="confirmPassword"
          placeholder="Confirm Password"
          noLabel
        />
      </div>

      <!-- Submit button -->
      <Button type="button" class="w-full" @click="handleResetPassword">Reset</Button>
    </div>

    <!-- Error dialog -->
    <ErrorDialog
      :open="isErrorDialogOpen"
      :message="errorMessage"
      @close="isErrorDialogOpen = false"
    />
  </FormCard>
</template>
