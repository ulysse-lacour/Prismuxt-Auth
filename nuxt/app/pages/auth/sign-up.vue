<script setup lang="ts">
  /**
   * Sign Up Page
   *
   * Provides a form for users to create a new account
   * Handles user registration and error display
   */
  import { signUp } from "~/utils/auth-client";

  // Define page metadata
  definePageMeta({
    layout: "default",
  });

  // Form state
  const firstName = ref("");
  const lastName = ref("");
  const email = ref("");
  const password = ref("");
  const isErrorDialogOpen = ref(false);
  const errorMessage = ref("");

  /**
   * Handle sign up form submission
   * Creates a new user account with the provided information
   */
  const handleSignUp = async () => {
    const user = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    };

    await signUp.email({
      email: user.email,
      password: user.password,
      name: `${user.firstName} ${user.lastName}`,
      callbackURL: "/",
      fetchOptions: {
        onError(context) {
          errorMessage.value = context.error.message;
          isErrorDialogOpen.value = true;
        },
        onSuccess() {
          useRouter().push("/dashboard");
        },
      },
    });
  };
</script>

<template>
  <!-- Using FormCard component for consistent layout -->
  <FormCard title="Sign Up" description="Enter your information to create an account">
    <div class="grid gap-4">
      <!-- Name fields (first and last name) -->
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="first-name">First name</Label>
          <Input id="first-name" v-model="firstName" placeholder="Max" required />
        </div>
        <div class="grid gap-2">
          <Label for="last-name">Last name</Label>
          <Input id="last-name" v-model="lastName" placeholder="Robinson" required />
        </div>
      </div>

      <!-- Email field -->
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
      </div>

      <!-- Using PasswordInput component -->
      <PasswordInput v-model="password" label="Password" placeholder="Enter your password" />

      <!-- Submit button -->
      <Button type="button" class="w-full" @click="handleSignUp">Create an account</Button>

      <!-- Sign in link -->
      <div class="mt-4 text-center text-sm">
        Already have an account?
        <NuxtLink to="/auth/sign-in" class="underline">Sign in</NuxtLink>
      </div>
    </div>

    <!-- Using ErrorDialog component -->
    <ErrorDialog v-model:open="isErrorDialogOpen" :message="errorMessage" />
  </FormCard>
</template>
