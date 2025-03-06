<script setup lang="ts">
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useUserDataStore } from "~/stores/userData";
  import { useForm } from "vee-validate";
  import * as z from "zod";

  const userDataStore = useUserDataStore();

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

  // Use useForm for form management
  const { handleSubmit: handleEmailSubmit } = useForm({
    validationSchema: emailFormSchema,
    initialValues: {
      email: userDataStore.user.email || "",
    },
  });

  const onEmailSubmit = handleEmailSubmit(async (values: { email: string }) => {
    try {
      const response = await $fetch<{ message: string }>("/api/account/update-email", {
        method: "PUT",
        body: { email: values.email },
      });

      userDataStore.updateUser({ email: values.email });

      toast({
        title: "Email updated",
        description: response.message,
      });
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: "Email update failed",
        description: "Please try again",
      });
    }
  });
</script>

<template>
  <form @submit="onEmailSubmit" class="space-y-8">
    <FormField v-slot="{ field, errorMessage }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input v-bind="field" v-model="field.value" type="email" placeholder="Enter your email" />
        </FormControl>
        <FormMessage class="whitespace-normal text-xs">{{ errorMessage }}</FormMessage>
      </FormItem>
    </FormField>
    <div class="flex justify-end">
      <Button type="submit">Update email</Button>
    </div>
  </form>
</template>
