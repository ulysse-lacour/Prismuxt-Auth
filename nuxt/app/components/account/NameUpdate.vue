<script setup lang="ts">
  /**
   * Name Update Component
   *
   * Provides a form for updating the user's first and last name
   * Handles validation and submission to the API
   */
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useUserDataStore } from "~/stores/userData";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  /**
   * Define validation schema using zod
   * Validates first and last name fields
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
   * Initialize form with validation and default values
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
   * @param {Object} values - Form values containing firstName and lastName
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
  <form @submit="onNameSubmit" class="space-y-8">
    <div class="grid w-full grid-cols-2 gap-4">
      <!-- First name field -->
      <FormField v-slot="{ field, errorMessage }" name="firstName">
        <FormItem class="max-w-[200px]">
          <FormLabel>First name</FormLabel>
          <FormControl>
            <Input v-bind="field" placeholder="Enter your first name" />
          </FormControl>
          <FormMessage class="whitespace-normal text-xs">{{ errorMessage }}</FormMessage>
        </FormItem>
      </FormField>

      <!-- Last name field -->
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

    <!-- Submit button -->
    <div class="flex justify-end">
      <Button type="submit">Update name</Button>
    </div>
  </form>
</template>
