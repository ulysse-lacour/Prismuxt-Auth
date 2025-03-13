import EmailUpdate from "@/components/account/EmailUpdate.vue";
import {
  mockComponent,
  mockNuxtImport,
  mountSuspended,
  registerEndpoint,
} from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";

// Mock modules before variable declarations to avoid hoisting issues
vi.mock("~/components/ui/toast", () => {
  return {
    toast: vi.fn(),
  };
});

// Mock vee-validate
vi.mock("vee-validate", () => {
  return {
    useForm: () => ({
      handleSubmit: (callback) => async () => {
        await callback({ email: "test@example.com" });
        return true;
      },
    }),
  };
});

// Mock the form components
vi.mock("~/components/ui/form", () => {
  return {
    FormField: {
      name: "FormField",
      props: ["name"],
      template:
        '<div class="form-field"><slot :field="{ value: \'test@example.com\' }" :errorMessage="\'\'"/></div>',
    },
    FormItem: {
      name: "FormItem",
      template: '<div class="form-item"><slot /></div>',
    },
    FormLabel: {
      name: "FormLabel",
      template: '<label class="form-label"><slot /></label>',
    },
    FormControl: {
      name: "FormControl",
      template: '<div class="form-control"><slot /></div>',
    },
    FormMessage: {
      name: "FormMessage",
      template: '<div class="form-message"><slot /></div>',
    },
  };
});

// Mock the Input component
vi.mock("~/components/ui/input", () => {
  return {
    Input: {
      name: "Input",
      props: ["type", "placeholder", "modelValue"],
      template:
        '<input class="input" :type="type" :placeholder="placeholder" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    },
  };
});

// Mock the Button component
vi.mock("~/components/ui/button", () => {
  return {
    Button: {
      name: "Button",
      props: ["type"],
      template: '<button class="button" :type="type"><slot /></button>',
    },
  };
});

// Create mock functions that we can reference later
const mockUpdateUser = vi.fn();

// Mock the useUserDataStore composable using mockNuxtImport
mockNuxtImport("useUserDataStore", () => {
  return () => ({
    user: {
      email: "test@example.com",
    },
    updateUser: mockUpdateUser,
  });
});

// Register mock API endpoint instead of mocking $fetch
registerEndpoint("/api/account/update-email", {
  method: "PUT",
  handler: () => {
    return { message: "Email updated successfully" };
  },
});

// Get the mocked toast function from the import
const { toast } = vi.mocked(await import("~/components/ui/toast"));

describe("EmailUpdate Component", () => {
  it("can be imported", () => {
    // This test just verifies that the component can be imported
    expect(EmailUpdate).toBeDefined();
  });

  it("renders the form with email field", async () => {
    const wrapper = await mountSuspended(EmailUpdate);

    // Check if form exists
    expect(wrapper.find("form").exists()).toBe(true);

    // Check if email label is rendered
    expect(wrapper.find(".form-label").text()).toBe("Email");

    // Check if input field exists with correct attributes
    const input = wrapper.find(".input");
    expect(input.exists()).toBe(true);
    expect(input.attributes("type")).toBe("email");
    expect(input.attributes("placeholder")).toBe("Enter your email");

    // Check if submit button exists
    const button = wrapper.find(".button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Update email");
  });

  it("submits the form and updates the email", async () => {
    const wrapper = await mountSuspended(EmailUpdate);

    // Reset mock functions
    mockUpdateUser.mockClear();
    toast.mockClear();

    // Trigger form submission
    await wrapper.find("form").trigger("submit");

    // Wait for the next tick to allow async operations to complete
    await vi.waitFor(() => {
      // Check if the user data was updated
      expect(mockUpdateUser).toHaveBeenCalledWith({ email: "test@example.com" });

      // Check if the toast notification was shown
      expect(toast).toHaveBeenCalledWith({
        title: "Email updated",
        description: "Email updated successfully",
      });
    });
  });
});
