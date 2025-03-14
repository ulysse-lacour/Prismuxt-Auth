// Import after mocks
import { mockNuxtImport, mountSuspended, registerEndpoint } from "@nuxt/test-utils/runtime";
import PortfolioSettings from "~/components/portfolio/PortfolioSettings.vue";
import { describe, expect, it, vi } from "vitest";

// Mock toast
vi.mock("~/components/ui/toast", () => {
  return {
    toast: vi.fn(),
  };
});

// Mock form components
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
      props: ["type", "placeholder", "modelValue", "name"],
      template:
        '<input class="input" :type="type" :placeholder="placeholder" :name="name" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    },
  };
});

// Mock the Button component
vi.mock("~/components/ui/button", () => {
  return {
    Button: {
      name: "Button",
      props: ["type", "variant"],
      template: '<button class="button" :type="type"><slot /></button>',
    },
  };
});

// Mock DeleteConfirmDialog
vi.mock("~/components/form/DeleteConfirmDialog", () => {
  return {
    default: {
      name: "DeleteConfirmDialog",
      props: {
        open: Boolean,
        title: String,
        description: String,
        confirmText: String,
        cancelText: String,
        itemName: String,
      },
      template: '<div data-testid="delete-confirm-dialog"></div>',
      emits: ["update:open", "confirm", "cancel"],
    },
  };
});

// Mock vee-validate
vi.mock("vee-validate", () => {
  return {
    useForm: () => ({
      handleSubmit: (callback) => async () => {
        await callback({
          name: "Updated Portfolio",
          description: "Updated Description",
        });
        return true;
      },
      values: {
        name: "Test Portfolio",
        description: "Test Description",
      },
    }),
  };
});

// Mock the portfolio store
const mockportfoliosStore = {
  updatePortfolio: vi.fn(),
  deletePortfolio: vi.fn(),
  currentPortfolio: {
    id: "portfolio-1",
    name: "Test Portfolio",
    description: "Test Description",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// Mock imports
mockNuxtImport("usePortfoliosStore", () => {
  return () => mockportfoliosStore;
});

// Mock the router
mockNuxtImport("useRouter", () => {
  return () => ({
    push: vi.fn(),
    replace: vi.fn(),
    resolve: vi.fn(() => ({ href: "/test" })),
  });
});

// Get the mocked toast function from the import
const { toast } = vi.mocked(await import("~/components/ui/toast"));

// Register mock API endpoints
registerEndpoint("/api/portfolios/update", {
  method: "PUT",
  handler: () => {
    return {
      portfolio: {
        id: "portfolio-1",
        name: "Updated Portfolio",
        description: "Updated Description",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      message: "Portfolio updated successfully",
    };
  },
});

registerEndpoint("/api/portfolios/delete", {
  method: "DELETE",
  handler: () => {
    return {
      portfolio: {
        id: "portfolio-1",
        name: "Test Portfolio",
        description: "Test Description",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      message: "Portfolio deleted successfully",
    };
  },
});

describe("PortfolioSettings Component", () => {
  it("can be imported", () => {
    expect(PortfolioSettings).toBeTruthy();
  });

  it("renders the form with portfolio fields", async () => {
    const wrapper = await mountSuspended(PortfolioSettings);

    // Check if form exists
    expect(wrapper.find("form").exists()).toBe(true);

    // Check if labels are rendered
    const labels = wrapper.findAll(".form-label");
    expect(labels.length).toBeGreaterThan(0);

    // Check if input fields exist
    const inputs = wrapper.findAll(".input");
    expect(inputs.length).toBeGreaterThan(0);

    // Check if submit button exists
    const button = wrapper.find('button[type="submit"]');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Update Portfolio");
  });

  it("has a form that can be submitted", async () => {
    const wrapper = await mountSuspended(PortfolioSettings);

    // Check if form exists and has a submit button
    expect(wrapper.find("form").exists()).toBe(true);
    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.exists()).toBe(true);
  });

  it("renders delete dialog component", async () => {
    const wrapper = await mountSuspended(PortfolioSettings);

    // Check if the delete dialog component is rendered
    const deleteDialog = wrapper.find('[data-testid="delete-confirm-dialog"]');
    expect(deleteDialog.exists()).toBe(true);
  });
});
