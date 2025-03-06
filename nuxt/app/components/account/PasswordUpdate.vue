<script setup lang="ts">
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { Eye, EyeOff } from "lucide-vue-next";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  // Password visibility states
  const showCurrentPassword = ref(false);
  const showNewPassword = ref(false);

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

  // Use useForm for form management
  const { handleSubmit: handlePasswordSubmit } = useForm({
    validationSchema: passwordFormSchema,
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onPasswordSubmit = handlePasswordSubmit(
    async (values: { currentPassword: string; newPassword: string }) => {
      try {
        const response = await $fetch<{ message: string }>("/api/account/update-password", {
          method: "PUT",
          body: { currentPassword: values.currentPassword, newPassword: values.newPassword },
        });
        toast({
          title: "Password updated",
          description: response.message,
        });
      } catch (error) {
        console.error("Error updating password:", error);
        toast({
          title: "Password update failed",
          description: "Please try again",
        });
      }
    }
  );
</script>

<template>
  <form @submit="onPasswordSubmit" class="space-y-8">
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
  </form>
</template>
