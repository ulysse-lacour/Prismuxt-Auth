<script setup lang="ts">
  import { toTypedSchema } from "@vee-validate/zod";
  import { Eye, EyeOff } from "lucide-vue-next";
  import * as z from "zod";

  definePageMeta({
    layout: "auth",
  });

  // Password visibility states
  const showCurrentPassword = ref(false);
  const showNewPassword = ref(false);

  // Name form schema
  const nameFormSchema = toTypedSchema(
    z.object({
      firstName: z
        .string({
          required_error: "First name is required",
        })
        .min(2, {
          message: "First name must be at least 2 characters.",
        }),
      lastName: z
        .string({
          required_error: "Last name is required",
        })
        .min(2, {
          message: "Last name must be at least 2 characters.",
        }),
    })
  );

  const onNameSubmit = async (values: any) => {
    try {
      const response = await $fetch<{ message: string }>("/api/account/update-name", {
        method: "POST",
        body: { name: `${values.firstName} ${values.lastName}` },
      });
      console.log(response.message);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  // Email form schema
  const emailFormSchema = toTypedSchema(
    z.object({
      email: z
        .string({
          required_error: "Email is required",
        })
        .email("Invalid email address"),
    })
  );

  const onEmailSubmit = async (values: any) => {
    try {
      const response = await $fetch<{ message: string }>("/api/account/update-email", {
        method: "POST",
        body: { email: values.email },
      });
      console.log(response.message);
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  // Password form schema
  const passwordFormSchema = toTypedSchema(
    z.object({
      currentPassword: z
        .string({
          required_error: "Current password is required",
        })
        .min(1, "Current password is required"),
      newPassword: z
        .string({
          required_error: "New password is required",
        })
        .min(8, "Password must be at least 8 characters"),
    })
  );

  const onPasswordSubmit = async (values: any) => {
    try {
      const response = await $fetch<{ message: string }>("/api/account/update-password", {
        method: "POST",
        body: { currentPassword: values.currentPassword, newPassword: values.newPassword },
      });
      console.log(response.message);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };
</script>

<template>
  <div class="mx-auto flex max-w-2xl flex-1 flex-col gap-6 p-6">
    <div class="space-y-2">
      <h2 class="text-3xl font-bold tracking-tight">Account</h2>
      <p class="text-muted-foreground">Manage your account settings and set your preferences.</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Name Form -->
        <Form :validation-schema="nameFormSchema" @submit="onNameSubmit" class="space-y-8">
          <div class="grid w-full grid-cols-2 gap-4">
            <FormField v-slot="{ field, errorMessage }" name="firstName">
              <FormItem class="max-w-[200px]">
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input v-bind="field" placeholder="Enter your first name" />
                </FormControl>
                <FormMessage class="whitespace-normal text-xs">{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField v-slot="{ field, errorMessage }" name="lastName">
              <FormItem class="max-w-[200px]">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input v-bind="field" placeholder="Enter your last name" />
                </FormControl>
                <FormMessage class="whitespace-normal text-xs">{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>
          </div>
          <div class="flex justify-end">
            <Button type="submit">Update name</Button>
          </div>
        </Form>

        <Separator />

        <!-- Email Form -->
        <Form :validation-schema="emailFormSchema" @submit="onEmailSubmit" class="space-y-8">
          <FormField v-slot="{ field, errorMessage }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input v-bind="field" type="email" placeholder="Enter your email" />
              </FormControl>
              <FormMessage class="whitespace-normal text-xs">{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>
          <div class="flex justify-end">
            <Button type="submit">Update email</Button>
          </div>
        </Form>

        <Separator />

        <!-- Password Form -->
        <Form :validation-schema="passwordFormSchema" @submit="onPasswordSubmit" class="space-y-8">
          <div class="grid gap-4">
            <FormField v-slot="{ field, errorMessage }" name="currentPassword">
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="field"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      class="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                      @click="showCurrentPassword = !showCurrentPassword"
                    >
                      <Eye v-if="!showCurrentPassword" class="h-4 w-4" />
                      <EyeOff v-else class="h-4 w-4" />
                      <span class="sr-only">
                        {{ showCurrentPassword ? "Hide password" : "Show password" }}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage class="whitespace-normal text-xs">{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField v-slot="{ field, errorMessage }" name="newPassword">
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="field"
                      :type="showNewPassword ? 'text' : 'password'"
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      class="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <Eye v-if="!showNewPassword" class="h-4 w-4" />
                      <EyeOff v-else class="h-4 w-4" />
                      <span class="sr-only">
                        {{ showNewPassword ? "Hide password" : "Show password" }}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage class="whitespace-normal text-xs">{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>
          </div>
          <div class="flex justify-end">
            <Button type="submit">Update password</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  </div>
</template>
