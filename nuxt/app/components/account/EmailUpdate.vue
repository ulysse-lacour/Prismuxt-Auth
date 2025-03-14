<script setup lang="ts">
  /**
   * Email Update Component
   *
   * Provides a form for updating the user's email address
   * Handles validation and submission to the API
   */
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useUserDataStore } from "~/stores/userData";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  // Get user data from store
  const userDataStore = useUserDataStore();

  /**
   * Define validation schema using zod
   * Validates email format
   */
  const emailFormSchema = toTypedSchema(
    z.object({
      email: z
        .string({
          required_error: "Email is required",
        })
        .email("Invalid email address"),
    })
  );

  /**
   * Initialize form with validation and current email
   */
  const { handleSubmit: handleEmailSubmit } = useForm({
    validationSchema: emailFormSchema,
    initialValues: {
      email: userDataStore.user.email || "",
    },
  });

  /**
   * Handle form submission to update user's email
   * @param {Object} values - Form values containing email
   */
  const onEmailSubmit = handleEmailSubmit(async (values: { email: string }) => {
    try {
      // Send API request to update email
      const response = await $fetch<{ message: string }>("/api/account/update-email", {
        method: "PUT",
        body: { email: values.email },
      });

      // Update user data in store
      userDataStore.updateUser({ email: values.email } as any);

      // Show success notification
      toast({
        title: "Email updated",
        description: response.message,
      });
    } catch (error) {
      console.error("Error updating email:", error);

      // Show error notification
      toast({
        title: "Email update failed",
        description: "Please try again",
      });
    }
  });
</script>

<template>
  <form class="space-y-8" @submit="onEmailSubmit">
    <!-- Email field -->
    <FormField v-slot="{ field, errorMessage }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input v-bind="field" v-model="field.value" type="email" placeholder="Enter your email" />
        </FormControl>
        <FormMessage class="whitespace-normal text-xs">{{ errorMessage }}</FormMessage>
      </FormItem>
    </FormField>

    <!-- Submit button -->
    <div class="flex justify-end">
      <Button type="submit">Update email</Button>
    </div>
  </form>
</template>
