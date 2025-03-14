<script setup lang="ts">
  /**
   * Forget Password Page
   *
   * Provides a form for users to request a password reset
   * Sends a reset link to the user's email address
   */
  import { forgetPassword } from "~/utils/auth-client";

  // Define page metadata
  definePageMeta({
    layout: "default",
  });

  // Form state
  const email = ref("");
  const isDialogOpen = ref(false);
  const dialogMessage = ref("");
  const isSuccess = ref(false);

  /**
   * Handle forget password form submission
   * Sends a password reset link to the provided email
   */
  const handleForgetPassword = async () => {
    // Validate email input
    if (!email.value) {
      dialogMessage.value = "Please enter your email address";
      isSuccess.value = false;
      isDialogOpen.value = true;
      return;
    }

    await forgetPassword(
      {
        email: email.value,
        redirectTo: "/auth/reset-password",
      },
      {
        // onSuccess find the url with token in server console. For detail check forgetPassword section: https://www.better-auth.com/docs/authentication/email-password
        onSuccess() {
          dialogMessage.value = "Password reset link sent to your email";
          isSuccess.value = true;
          isDialogOpen.value = true;
        },
        onError(context) {
          dialogMessage.value = context.error.message;
          isSuccess.value = false;
          isDialogOpen.value = true;
        },
      }
    );
  };

  /**
   * Handle dialog close action
   * Redirects to sign-in page on successful password reset request
   */
  const handleDialogClose = () => {
    isDialogOpen.value = false;
    if (isSuccess.value) {
      window.location.href = "/auth/sign-in";
    }
  };
</script>

<template>
  <!-- Using FormCard component for consistent layout -->
  <FormCard title="Reset Password" description="Enter your email below to reset your password">
    <div class="grid gap-4">
      <!-- Email input field -->
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
      </div>

      <!-- Submit button -->
      <Button type="button" class="w-full" @click="handleForgetPassword"> Reset Password </Button>

      <!-- Back to sign in link -->
      <div class="mt-4 text-center text-sm">
        <NuxtLink to="/auth/sign-in" class="underline">Back to Sign In</NuxtLink>
      </div>
    </div>

    <!-- Custom dialog for success/error messages -->
    <AlertDialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{{ isSuccess ? "Success!" : "Oups..." }}</AlertDialogTitle>
          <AlertDialogDescription>
            {{ dialogMessage }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction @click="handleDialogClose">OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </FormCard>
</template>
