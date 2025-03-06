<script setup lang="ts">
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useUserDataStore } from "~/stores/userData";
  import { useForm } from "vee-validate";
  import * as z from "zod";

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

  // Use useForm for form management
  const { handleSubmit: handleNameSubmit } = useForm({
    validationSchema: nameFormSchema,
    initialValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onNameSubmit = handleNameSubmit(async (values: { firstName: string; lastName: string }) => {
    try {
      const response = await $fetch<{ message: string }>("/api/account/update-name", {
        method: "PUT",
        body: { name: `${values.firstName} ${values.lastName}` },
      });

      const userDataStore = useUserDataStore();
      userDataStore.updateUser({ name: `${values.firstName} ${values.lastName}` });

      toast({
        title: "Name updated",
        description: response.message,
      });
    } catch (error) {
      console.error("Error updating name:", error);
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
  </form>
</template>
