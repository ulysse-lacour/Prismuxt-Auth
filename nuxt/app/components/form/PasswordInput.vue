<script setup lang="ts">
  /**
   * Password Input Component
   *
   * Reusable password input field with show/hide toggle functionality
   * Used across authentication forms
   */
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Eye, EyeOff } from "lucide-vue-next";

  // Component props
  interface Props {
    modelValue: string;
    id?: string;
    placeholder?: string;
    required?: boolean;
    label?: string;
    forgotPasswordLink?: boolean;
    noLabel?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    id: "password",
    placeholder: "Enter your password",
    required: true,
    label: "Password",
    forgotPasswordLink: false,
    noLabel: false,
  });

  // Emit events for v-model
  const emit = defineEmits(["update:modelValue"]);

  // Password visibility state
  const showPassword = ref(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };

  // Update model value
  const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.value);
  };
</script>

<template>
  <div class="grid gap-2">
    <!-- Password label with optional forgot password link -->
    <div class="flex items-center">
      <Label v-if="!noLabel" :for="id">{{ label }}</Label>
      <NuxtLink
        v-if="forgotPasswordLink"
        to="/auth/forget-password"
        class="ml-auto inline-block text-sm underline"
      >
        Forgot your password?
      </NuxtLink>
    </div>

    <!-- Password input with show/hide toggle -->
    <div class="relative">
      <Input
        :id="id"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="placeholder"
        :value="modelValue"
        :required="required"
        @input="updateValue"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
        @click="togglePasswordVisibility"
      >
        <Eye v-if="!showPassword" class="h-4 w-4" />
        <EyeOff v-else class="h-4 w-4" />
        <span class="sr-only">
          {{ showPassword ? "Hide password" : "Show password" }}
        </span>
      </Button>
    </div>
  </div>
</template>
