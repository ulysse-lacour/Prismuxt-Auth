<script setup lang="ts">
  /**
   * Theme Settings Form
   *
   * Displays and manages theme settings for the current user
   * Provides form for updating theme appearance, fonts, colors, and company information
   */

  import { Button } from "@/components/ui/button";
  import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { toTypedSchema } from "@vee-validate/zod";
  import { toast } from "~/components/ui/toast";
  import { useThemeManagement } from "~/composables/useThemeManagement";
  import { useThemeSettingsStore } from "~/stores/themeSettings";
  import { useSession } from "~/utils/auth-client";
  import { useForm } from "vee-validate";
  import * as z from "zod";
  import type { ThemeSettings } from "@prisma/client";

  // Check if user is authenticated
  const { data: session } = await useSession(useFetch);

  // Composables
  const themeStore = useThemeSettingsStore();
  const { saveThemeSettings, fetchThemeSettings } = useThemeManagement();

  // Fetch theme settings if user is authenticated
  if (session.value) {
    await fetchThemeSettings();
  }

  // Get the current theme settings
  const settings = themeStore.settings;

  /**
   * Define validation schema using zod
   * Validates form fields before submission
   */
  const themeFormSchema = toTypedSchema(
    z.object({
      logoUrl: z.string().optional().nullable(),
      headingFont: z.string().optional().nullable(),
      bodyFont: z.string().optional().nullable(),
      backgroundColor: z.string().optional().nullable(),
      textColor: z.string().optional().nullable(),
      accentColor: z.string().optional().nullable(),
      secondaryColor: z.string().optional().nullable(),
      companyName: z.string().optional().nullable(),
      companyDescription: z.string().optional().nullable(),
      companyEmail: z.string().email("Please enter a valid email").optional().nullable(),
      companyPhone: z.string().optional().nullable(),
      companyAddress: z.string().optional().nullable(),
      defaultLanguageId: z.string().optional().nullable(),
    })
  );

  /**
   * Initialize form with validation and theme settings data
   */
  const { handleSubmit } = useForm({
    validationSchema: themeFormSchema,
    initialValues: {
      logoUrl: settings?.logoUrl || "",
      headingFont: settings?.headingFont || "",
      bodyFont: settings?.bodyFont || "",
      backgroundColor: settings?.backgroundColor || "",
      textColor: settings?.textColor || "",
      accentColor: settings?.accentColor || "",
      secondaryColor: settings?.secondaryColor || "",
      companyName: settings?.companyName || "",
      companyDescription: settings?.companyDescription || "",
      companyEmail: settings?.companyEmail || "",
      companyPhone: settings?.companyPhone || "",
      companyAddress: settings?.companyAddress || "",
      defaultLanguageId: settings?.defaultLanguageId || "",
    },
  });

  /**
   * Handle theme settings form submission
   * Updates theme settings and refreshes the view
   */
  const submitThemeSettings = handleSubmit(async (values) => {
    try {
      await saveThemeSettings(values);

      // Show success notification
      toast({
        title: "Theme settings updated",
        description: "Your theme settings have been updated successfully",
      });
    } catch (error) {
      console.error("Failed to update theme settings:", error);

      // Show error notification
      toast({
        title: "Update failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  });
</script>

<template>
  <div>
    <div class="w-full rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <!-- Page header -->
      <div class="space-y-2">
        <h2 class="text-2xl font-semibold">Theme Settings</h2>
        <p class="text-sm text-muted-foreground">
          Customize your portfolio appearance and company information.
        </p>
      </div>

      <!-- Theme settings form -->
      <form class="space-y-4" @submit="submitThemeSettings">
        <!-- Logo Settings -->
        <div class="space-y-4 pt-4">
          <h3 class="text-lg font-medium">Logo</h3>
          <FormField v-slot="{ field, errorMessage }" name="logoUrl">
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input
                  v-bind="field"
                  v-model="field.value"
                  type="text"
                  placeholder="https://example.com/logo.svg"
                  class="w-full max-w-6xl"
                />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>
        </div>

        <!-- Typography Settings -->
        <div class="space-y-4 border-t pt-4">
          <h3 class="text-lg font-medium">Typography</h3>
          <div class="grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
            <FormField v-slot="{ field, errorMessage }" name="headingFont">
              <FormItem>
                <FormLabel>Heading Font</FormLabel>
                <FormControl>
                  <Input
                    v-bind="field"
                    v-model="field.value"
                    type="text"
                    placeholder="Inter"
                    class="w-full"
                  />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField v-slot="{ field, errorMessage }" name="bodyFont">
              <FormItem>
                <FormLabel>Body Font</FormLabel>
                <FormControl>
                  <Input
                    v-bind="field"
                    v-model="field.value"
                    type="text"
                    placeholder="Roboto"
                    class="w-full"
                  />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Color Settings -->
        <div class="space-y-4 border-t pt-4">
          <h3 class="text-lg font-medium">Colors</h3>
          <div class="grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
            <FormField v-slot="{ field, errorMessage }" name="backgroundColor">
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <div class="flex">
                    <Input
                      v-bind="field"
                      v-model="field.value"
                      type="text"
                      placeholder="#ffffff"
                      class="flex-1 rounded-r-none"
                    />
                    <input
                      type="color"
                      disabled
                      v-model="field.value"
                      class="h-9 w-9 rounded-r-md border border-input bg-background"
                    />
                  </div>
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField v-slot="{ field, errorMessage }" name="textColor">
              <FormItem>
                <FormLabel>Text Color</FormLabel>
                <FormControl>
                  <div class="flex">
                    <Input
                      v-bind="field"
                      v-model="field.value"
                      type="text"
                      placeholder="#000000"
                      class="flex-1 rounded-r-none"
                    />
                    <input
                      type="color"
                      disabled
                      v-model="field.value"
                      class="h-9 w-9 rounded-r-md border border-input bg-background"
                    />
                  </div>
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField v-slot="{ field, errorMessage }" name="accentColor">
              <FormItem>
                <FormLabel>Accent Color</FormLabel>
                <FormControl>
                  <div class="flex">
                    <Input
                      v-bind="field"
                      v-model="field.value"
                      type="text"
                      placeholder="#3b82f6"
                      class="flex-1 rounded-r-none"
                    />
                    <input
                      type="color"
                      disabled
                      v-model="field.value"
                      class="h-9 w-9 rounded-r-md border border-input bg-background"
                    />
                  </div>
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField v-slot="{ field, errorMessage }" name="secondaryColor">
              <FormItem>
                <FormLabel>Secondary Color</FormLabel>
                <FormControl>
                  <div class="flex">
                    <Input
                      v-bind="field"
                      v-model="field.value"
                      type="text"
                      placeholder="#10b981"
                      class="flex-1 rounded-r-none"
                    />
                    <input
                      type="color"
                      disabled
                      v-model="field.value"
                      class="h-9 w-9 rounded-r-md border border-input bg-background"
                    />
                  </div>
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Company Information -->
        <div class="space-y-4 border-t pt-4">
          <h3 class="text-lg font-medium">Company Information</h3>

          <FormField v-slot="{ field, errorMessage }" name="companyName">
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  v-bind="field"
                  v-model="field.value"
                  type="text"
                  placeholder="Your Company Name"
                  class="w-full max-w-6xl"
                />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>

          <FormField v-slot="{ field, errorMessage }" name="companyDescription">
            <FormItem>
              <FormLabel>Company Description</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="field"
                  v-model="field.value"
                  placeholder="Brief description of your company"
                  class="min-h-[100px] w-full max-w-6xl resize-none"
                />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>

          <div class="grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
            <FormField v-slot="{ field, errorMessage }" name="companyEmail">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    v-bind="field"
                    v-model="field.value"
                    type="email"
                    placeholder="contact@example.com"
                    class="w-full"
                  />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>

            <FormField v-slot="{ field, errorMessage }" name="companyPhone">
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    v-bind="field"
                    v-model="field.value"
                    type="tel"
                    placeholder="+1 (123) 456-7890"
                    class="w-full"
                  />
                </FormControl>
                <FormMessage>{{ errorMessage }}</FormMessage>
              </FormItem>
            </FormField>
          </div>

          <FormField v-slot="{ field, errorMessage }" name="companyAddress">
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  v-bind="field"
                  v-model="field.value"
                  type="text"
                  placeholder="123 Main St, City, Country"
                  class="w-full max-w-6xl"
                />
              </FormControl>
              <FormMessage>{{ errorMessage }}</FormMessage>
            </FormItem>
          </FormField>
        </div>

        <!-- Form action buttons -->
        <div class="flex justify-end border-t pt-4">
          <Button type="submit" class="w-full sm:w-auto">Save Settings</Button>
        </div>
      </form>
    </div>
  </div>
</template>
