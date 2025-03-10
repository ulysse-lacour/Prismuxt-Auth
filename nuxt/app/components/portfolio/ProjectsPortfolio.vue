<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    Combobox,
    ComboboxAnchor,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxList,
    ComboboxTrigger,
  } from "@/components/ui/combobox";
  import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { toast } from "@/components/ui/toast";
  import { cn } from "@/lib/utils";
  import { toTypedSchema } from "@vee-validate/zod";
  import { Check, ChevronsUpDown, Search } from "lucide-vue-next";
  import { useForm } from "vee-validate";
  import { h, ref } from "vue";
  import * as z from "zod";

  const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt", label: "Nuxt" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
  ];

  const value = ref<(typeof frameworks)[0]>();

  const formSchema = toTypedSchema(
    z.object({
      frameworks: z.string({
        required_error: "Please select a language.",
      }),
    })
  );

  const { handleSubmit, setFieldValue } = useForm({
    validationSchema: formSchema,
    initialValues: {
      frameworks: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    toast({
      title: "You submitted the following values:",
      description: h(
        "pre",
        { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
        h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
      ),
    });
  });
</script>

<template>
  <form class="space-y-6" @submit="onSubmit">
    <FormField name="language">
      <FormItem class="flex flex-col">
        <FormLabel>Language</FormLabel>
        <Combobox v-model="value" by="label">
          <FormControl>
            <ComboboxAnchor as-child>
              <ComboboxTrigger as-child>
                <Button variant="outline" class="justify-between">
                  {{ value?.label ?? "Select framework" }}

                  <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ComboboxTrigger>
            </ComboboxAnchor>
          </FormControl>

          <ComboboxList>
            <div class="relative w-full max-w-sm items-center">
              <ComboboxInput
                class="h-10 rounded-none border-0 border-b pl-9 focus-visible:ring-0"
                placeholder="Select framework..."
              />
              <span class="absolute inset-y-0 start-0 flex items-center justify-center px-3">
                <Search class="size-4 text-muted-foreground" />
              </span>
            </div>

            <ComboboxEmpty> No framework found. </ComboboxEmpty>

            <ComboboxGroup>
              <ComboboxItem
                v-for="framework in frameworks"
                :key="framework.value"
                :value="framework"
                @select="
                  () => {
                    setFieldValue('frameworks', framework.value);
                  }
                "
              >
                {{ framework.label }}

                <ComboboxItemIndicator>
                  <Check :class="cn('ml-auto h-4 w-4')" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            </ComboboxGroup>
          </ComboboxList>
        </Combobox>

        <FormDescription>
          This is the language that will be used in the dashboard.
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit"> Submit </Button>
  </form>
</template>
