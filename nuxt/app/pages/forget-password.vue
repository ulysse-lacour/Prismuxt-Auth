<script lang="ts" setup>
  import { forgetPassword } from "~/utils/auth-client";

  const email = ref("");
  const isDialogOpen = ref(false);
  const dialogMessage = ref("");
  const isSuccess = ref(false);

  const handleForgetPassword = async () => {
    if (!email.value) {
      dialogMessage.value = "Please enter your email address";
      isSuccess.value = false;
      isDialogOpen.value = true;
      return;
    }
    await forgetPassword(
      {
        email: email.value,
        redirectTo: "/reset-password",
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

  const handleDialogClose = () => {
    isDialogOpen.value = false;
    if (isSuccess.value) {
      window.location.href = "/sign-in";
    }
  };
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <CardRoot class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Reset Password</CardTitle>
        <CardDescription> Enter your email below to reset your password </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required v-model="email" />
          </div>
          <Button type="button" class="w-full" @click="handleForgetPassword">
            Reset Password
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          <a href="/sign-in" class="underline">Back to Sign In </a>
        </div>
      </CardContent>
    </CardRoot>

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
  </div>
</template>
