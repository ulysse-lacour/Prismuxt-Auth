import NameUpdate from "@/components/account/NameUpdate.vue";
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
        await callback({ firstName: "John", lastName: "Doe" });
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
        '<div class="form-field"><slot :field="{ value: \'test\' }" :errorMessage="\'\'"/></div>',
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
      props: ["placeholder", "modelValue"],
      template:
        '<input class="input" :placeholder="placeholder" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
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
      name: "John Doe",
    },
    updateUser: mockUpdateUser,
  });
});

// Register mock API endpoint instead of mocking $fetch
registerEndpoint("/api/account/update-name", {
  method: "PUT",
  handler: () => {
    return { message: "Name updated successfully" };
  },
});

// Get the mocked toast function from the import
const { toast } = vi.mocked(await import("~/components/ui/toast"));

describe("NameUpdate Component", () => {
  it("can be imported", () => {
    // This test just verifies that the component can be imported
    expect(NameUpdate).toBeDefined();
  });

  it("renders the form with first name and last name fields", async () => {
    const wrapper = await mountSuspended(NameUpdate);

    // Check if form exists
    expect(wrapper.find("form").exists()).toBe(true);

    // Check if first name label is rendered
    const formLabels = wrapper.findAll(".form-label");
    expect(formLabels.length).toBe(2);
    expect(formLabels[0]?.text()).toBe("First name");
    expect(formLabels[1]?.text()).toBe("Last name");

    // Check if input fields exist with correct attributes
    const inputs = wrapper.findAll(".input");
    expect(inputs.length).toBe(2);
    expect(inputs[0]?.attributes("placeholder")).toBe("Enter your first name");
    expect(inputs[1]?.attributes("placeholder")).toBe("Enter your last name");

    // Check if submit button exists
    const button = wrapper.find(".button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Update name");
  });

  it("submits the form and updates the name", async () => {
    const wrapper = await mountSuspended(NameUpdate);

    // Reset mock functions
    mockUpdateUser.mockClear();
    toast.mockClear();

    // Trigger form submission
    await wrapper.find("form").trigger("submit");

    // Wait for the next tick to allow async operations to complete
    await vi.waitFor(() => {
      // Check if the user data was updated
      expect(mockUpdateUser).toHaveBeenCalledWith({ name: "John Doe" });

      // Check if the toast notification was shown
      expect(toast).toHaveBeenCalledWith({
        title: "Name updated",
        description: "Name updated successfully",
      });
    });
  });
});
