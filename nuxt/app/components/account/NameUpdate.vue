<script setup lang="ts">
  /**
   * Name Update Component
   *
   * Provides a form for updating the user's first and last name.
   * Uses vee-validate with zod for form validation and handles API submission.
   * Updates the user store on successful submission.
   */
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useUserDataStore } from "~/stores/userData";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  /**
   * Form validation schema using zod
   *
   * Validates that:
   * - First name is required and at least 2 characters
   * - Last name is required and at least 2 characters
   */
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

  /**
   * Initialize form with validation schema and empty default values
   */
  const { handleSubmit: handleNameSubmit } = useForm({
    validationSchema: nameFormSchema,
    initialValues: {
      firstName: "",
      lastName: "",
    },
  });

  /**
   * Handle form submission to update user's name
   *
   * 1. Sends API request to update name
   * 2. Updates local user data store
   * 3. Shows success/error toast notification
   *
   * @param values - Form values containing firstName and lastName
   */
  const onNameSubmit = handleNameSubmit(async (values: { firstName: string; lastName: string }) => {
    try {
      // Send API request to update name
      const response = await $fetch<{ message: string }>("/api/account/update-name", {
        method: "PUT",
        body: { name: `${values.firstName} ${values.lastName}` },
      });

      // Update user data in store
      const userDataStore = useUserDataStore();
      userDataStore.updateUser({ name: `${values.firstName} ${values.lastName}` } as any);

      // Show success notification
      toast({
        title: "Name updated",
        description: response.message,
      });
    } catch (error) {
      console.error("Error updating name:", error);

      // Show error notification
      toast({
        title: "Name update failed",
        description: "Please try again",
      });
    }
  });
</script>

<template>
  <form class="space-y-8" @submit="onNameSubmit">
    <div class="grid w-full grid-cols-2 gap-4">
      <!-- First name input field -->
      <FormField v-slot="{ field, errorMessage }" name="firstName">
        <FormItem class="max-w-[200px]">
          <FormLabel>First name</FormLabel>
          <FormControl>
            <Input v-bind="field" placeholder="Enter your first name" />
          </FormControl>
          <FormMessage class="whitespace-normal text-xs">{{ errorMessage }}</FormMessage>
        </FormItem>
      </FormField>

      <!-- Last name input field -->
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

    <!-- Form submission button -->
    <div class="flex justify-end">
      <Button type="submit">Update name</Button>
    </div>
  </form>
</template>
