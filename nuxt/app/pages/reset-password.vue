<script lang="ts" setup>
  import { resetPassword } from "~/utils/auth-client";
  import { Eye, EyeOff } from "lucide-vue-next";

  const confirmPassword = ref("");
  const password = ref("");
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const isErrorDialogOpen = ref(false);
  const errorMessage = ref("");

  const handleResetPassword = async () => {
    if (confirmPassword.value !== password.value) {
      errorMessage.value = "Please enter same passwords";
      isErrorDialogOpen.value = true;
      return;
    }

    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      errorMessage.value = "Invalid token, contact support";
      isErrorDialogOpen.value = true;
      return;
    }

    await resetPassword({
      newPassword: password.value,
      token: token,
      fetchOptions: {
        onSuccess(context) {
          window.location.href = "/sign-in";
        },
        onError(context) {
          errorMessage.value = "Something went wrong, contact support.";
          isErrorDialogOpen.value = true;
        },
      },
    });
  };
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <CardRoot class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="password">New Password</Label>
            <div class="relative">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                required
                v-model="password"
                placeholder="New Password"
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
          <div class="grid gap-2">
            <Label for="confirm-password">Confirm Password</Label>
            <div class="relative">
              <Input
                id="confirm-password"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                placeholder="Confirm Password"
                v-model="confirmPassword"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                class="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <Eye v-if="!showConfirmPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
                <span class="sr-only">
                  {{ showConfirmPassword ? "Hide password" : "Show password" }}
                </span>
              </Button>
            </div>
          </div>
          <Button type="button" class="w-full" @click="handleResetPassword">Reset</Button>
        </div>
      </CardContent>
    </CardRoot>

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
