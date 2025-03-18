<script setup lang="ts">
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { computed } from "vue";
  import type { Language } from "@prisma/client";

  // Define a type for the languages object
  type LanguagesObject = {
    languages: Language[];
  };

  const props = defineProps<{
    languages: LanguagesObject;
    selectedLanguage: string;
  }>();

  // Define emit for updating the selected language
  const emit = defineEmits<{
    "update:selectedLanguage": [value: string];
  }>();

  // Create a computed property for two-way binding
  const modelValue = computed({
    get: () => props.selectedLanguage,
    set: (value) => emit("update:selectedLanguage", value),
  });

  // Access the languages array from the object
  const languagesArray = computed(() => props.languages.languages || []);

  // Get the current language name for display
  const currentLanguageName = computed(() => {
    const currentLanguage = languagesArray.value.find(
      (lang) => lang.code === props.selectedLanguage
    );
    return currentLanguage?.name || "";
  });
</script>

<template>
  <div>
    <Select v-model="modelValue">
      <SelectTrigger class="w-[180px] rounded-full bg-[#C5C5C5] text-black">
        <SelectValue>{{ currentLanguageName }}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="language in languagesArray" :key="language.id" :value="language.code">
            {{ language.name }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
