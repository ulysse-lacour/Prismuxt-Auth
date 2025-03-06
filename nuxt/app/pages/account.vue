<script setup lang="ts">
  import { toTypedSchema } from "@vee-validate/zod";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  definePageMeta({
    layout: "auth",
  });

  // Name form
  const nameFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
  });

  const nameForm = useForm({
    validationSchema: toTypedSchema(nameFormSchema),
    initialValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onNameSubmit = nameForm.handleSubmit((values) => {
    console.log("Name updated:", values);
  });

  // Email form
  const emailFormSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
  });

  const emailForm = useForm({
    validationSchema: toTypedSchema(emailFormSchema),
    initialValues: {
      email: "",
    },
  });

  const onEmailSubmit = emailForm.handleSubmit((values) => {
    console.log("Email updated:", values);
  });

  // Password form
  const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
  });

  const passwordForm = useForm({
    validationSchema: toTypedSchema(passwordFormSchema),
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onPasswordSubmit = passwordForm.handleSubmit((values) => {
    console.log("Password updated:", values);
  });
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
        <form @submit="onNameSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <FormField v-slot="{ componentField }" name="firstName">
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Enter your first name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="lastName">
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" placeholder="Enter your last name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="flex justify-end">
            <Button type="submit">Update name</Button>
          </div>
        </form>

        <Separator />

        <!-- Email Form -->
        <form @submit="onEmailSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="email" placeholder="Enter your email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="flex justify-end">
            <Button type="submit">Update email</Button>
          </div>
        </form>

        <Separator />

        <!-- Password Form -->
        <form @submit="onPasswordSubmit" class="space-y-4">
          <FormField v-slot="{ componentField }" name="currentPassword">
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="password"
                  placeholder="Enter current password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="newPassword">
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="password" placeholder="Enter new password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="flex justify-end">
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
