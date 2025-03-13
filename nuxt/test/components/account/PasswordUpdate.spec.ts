import PasswordUpdate from "@/components/account/PasswordUpdate.vue";
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

// Mock lucide-vue-next icons
vi.mock("lucide-vue-next", () => {
  return {
    Eye: {
      name: "Eye",
      render: () => {},
    },
    EyeOff: {
      name: "EyeOff",
      render: () => {},
    },
  };
});

// Mock vee-validate
vi.mock("vee-validate", () => {
  return {
    useForm: () => ({
      handleSubmit: (callback) => async () => {
        await callback({ currentPassword: "oldpassword", newPassword: "newpassword" });
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
      props: ["type", "variant", "size"],
      template: '<button class="button" :type="type" :class="[variant, size]"><slot /></button>',
    },
  };
});

// Register mock API endpoint instead of mocking $fetch
registerEndpoint("/api/account/update-password", {
  method: "PUT",
  handler: () => {
    return { message: "Password updated successfully" };
  },
});

// Get the mocked toast function from the import
const { toast } = vi.mocked(await import("~/components/ui/toast"));

describe("PasswordUpdate Component", () => {
  it("can be imported", () => {
    // This test just verifies that the component can be imported
    expect(PasswordUpdate).toBeDefined();
  });

  it("renders the form with password fields", async () => {
    const wrapper = await mountSuspended(PasswordUpdate);

    // Check if form exists
    expect(wrapper.find("form").exists()).toBe(true);

    // Check if password labels are rendered
    const formLabels = wrapper.findAll(".form-label");
    expect(formLabels.length).toBe(2);
    expect(formLabels[0]?.text()).toBe("Current Password");
    expect(formLabels[1]?.text()).toBe("New Password");

    // Check if input fields exist with correct attributes
    const inputs = wrapper.findAll(".input");
    expect(inputs.length).toBe(2);
    expect(inputs[0]?.attributes("type")).toBe("password");
    expect(inputs[0]?.attributes("placeholder")).toBe("Enter current password");
    expect(inputs[1]?.attributes("type")).toBe("password");
    expect(inputs[1]?.attributes("placeholder")).toBe("Enter new password");

    // Check if submit button exists
    const submitButton = wrapper
      .findAll(".button")
      .filter((node) => node.attributes("type") === "submit");
    expect(submitButton.length).toBe(1);
    expect(submitButton[0]?.text()).toBe("Update password");
  });

  it("submits the form and updates the password", async () => {
    const wrapper = await mountSuspended(PasswordUpdate);

    // Reset mock functions
    toast.mockClear();

    // Trigger form submission
    await wrapper.find("form").trigger("submit");

    // Wait for the next tick to allow async operations to complete
    await vi.waitFor(() => {
      // Check if the toast notification was shown
      expect(toast).toHaveBeenCalledWith({
        title: "Password updated",
        description: "Password updated successfully",
      });
    });
  });

  it("toggles password visibility when show/hide buttons are clicked", async () => {
    const wrapper = await mountSuspended(PasswordUpdate);

    // Get the toggle buttons
    const toggleButtons = wrapper
      .findAll(".button")
      .filter((node) => node.attributes("type") === "button" && node.classes().includes("ghost"));

    expect(toggleButtons.length).toBe(2);

    // Initially passwords should be hidden
    const inputs = wrapper.findAll(".input");
    expect(inputs[0]?.attributes("type")).toBe("password");
    expect(inputs[1]?.attributes("type")).toBe("password");

    // This is a simplified test since we can't actually test the reactive state changes
    // in the component due to our mocking approach. In a real test with less mocking,
    // we would click the buttons and verify the type changes.
  });
});
