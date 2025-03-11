<script setup lang="ts">
  /**
   * Sign In Page
   *
   * Provides a form for users to sign in to their account
   * Handles authentication and error display
   */
  import { signIn } from "~/utils/auth-client";
  import { Eye, EyeOff } from "lucide-vue-next";

  // Define page metadata
  definePageMeta({
    layout: "default",
  });

  // Form state
  const email = ref("");
  const password = ref("");
  const showPassword = ref(false);
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
  <div class="flex h-screen items-center justify-center">
    <!-- Sign in card -->
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription> Enter your email below to login to your account </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <!-- Email input field -->
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" v-model="email" required />
          </div>

          <!-- Password input field with show/hide toggle -->
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a href="/auth/forget-password" class="ml-auto inline-block text-sm underline">
                Forgot your password?
              </a>
            </div>
            <div class="relative">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="password"
                v-model="password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                class="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
                <span class="sr-only">
                  {{ showPassword ? "Hide password" : "Show password" }}
                </span>
              </Button>
            </div>
          </div>

          <!-- Submit button -->
          <Button type="submit" class="w-full" @click="handleSignIn"> Login </Button>

          <!-- Sign up link -->
          <div class="mt-4 text-center text-sm">
            Don't have an account?
            <a href="/auth/sign-up" class="underline"> Sign up </a>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Error dialog -->
    <AlertDialog :open="isErrorDialogOpen" @update:open="isErrorDialogOpen = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Oups...</AlertDialogTitle>
          <AlertDialogDescription>
            {{ errorMessage }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction @click="isErrorDialogOpen = false">OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
