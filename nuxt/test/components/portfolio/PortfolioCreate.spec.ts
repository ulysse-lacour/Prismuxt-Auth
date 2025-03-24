import PortfolioCreate from "@/components/portfolio/PortfolioCreate.vue";
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
        await callback({ name: "Test Portfolio", description: "Test Description" });
        return true;
      },
      resetForm: vi.fn(),
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
      props: ["type", "placeholder", "modelValue", "class"],
      template:
        '<input class="input" :type="type" :placeholder="placeholder" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    },
  };
});

// Mock the Textarea component
vi.mock("~/components/ui/textarea", () => {
  return {
    Textarea: {
      name: "Textarea",
      props: ["placeholder", "modelValue", "class"],
      template:
        '<textarea class="textarea" :placeholder="placeholder" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
    },
  };
});

// Mock the Button component
vi.mock("~/components/ui/button", () => {
  return {
    Button: {
      name: "Button",
      props: ["type", "class"],
      template: '<button class="button" :type="type"><slot /></button>',
    },
  };
});

// Create mock functions that we can reference later
const mockAddPortfolio = vi.fn();
const mockPush = vi.fn();
const mockProcessPortfolioData = vi.fn().mockImplementation((data) => data);
const mockCreatePortfolio = vi.fn().mockResolvedValue({
  createdPortfolio: {
    portfolio: {
      id: "123",
      name: "Test Portfolio",
      description: "Test Description",
      slug: "test-portfolio",
    },
  },
});

// Mock the useRouter composable
mockNuxtImport("useRouter", () => {
  return () => ({
    push: mockPush,
    replace: vi.fn(),
  });
});

// Mock the usePortfolioData composable
mockNuxtImport("usePortfolioData", () => {
  return () => ({
    processPortfolioData: mockProcessPortfolioData,
  });
});

// Mock the usePortfoliosStore composable
mockNuxtImport("usePortfoliosStore", () => {
  return () => ({
    addPortfolio: mockAddPortfolio,
  });
});

// Mock the usePortfolioManagement composable
mockNuxtImport("usePortfolioManagement", () => {
  return () => ({
    createPortfolio: mockCreatePortfolio,
  });
});

// Register mock API endpoint
registerEndpoint("/api/portfolio/create", {
  method: "POST",
  handler: () => {
    return {
      portfolio: {
        id: "123",
        name: "Test Portfolio",
        description: "Test Description",
        slug: "test-portfolio",
      },
      message: "Portfolio created successfully",
    };
  },
});

// Get the mocked toast function from the import
const { toast } = vi.mocked(await import("~/components/ui/toast"));

describe("PortfolioCreate Component", () => {
  it("can be imported", () => {
    // This test just verifies that the component can be imported
    expect(PortfolioCreate).toBeDefined();
  });

  it("renders the form with portfolio fields", async () => {
    const wrapper = await mountSuspended(PortfolioCreate);

    // Check if form exists
    expect(wrapper.find("form").exists()).toBe(true);

    // Check if the title is rendered
    expect(wrapper.find("h2").text()).toBe("Add portfolio");

    // Check if name label is rendered
    const formLabels = wrapper.findAll(".form-label");
    expect(formLabels.length).toBe(2);
    expect(formLabels[0]?.text()).toBe("Name");
    expect(formLabels[1]?.text()).toBe("Description");

    // Check if input fields exist with correct attributes
    const input = wrapper.find(".input");
    expect(input.exists()).toBe(true);
    expect(input.attributes("type")).toBe("text");
    expect(input.attributes("placeholder")).toBe("Enter portfolio name");

    // Check if textarea exists with correct attributes
    const textarea = wrapper.find(".textarea");
    expect(textarea.exists()).toBe(true);
    expect(textarea.attributes("placeholder")).toBe("Enter portfolio description");

    // Check if submit button exists
    const button = wrapper.find(".button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Create Portfolio");
  });

  it("submits the form and creates a portfolio", async () => {
    const wrapper = await mountSuspended(PortfolioCreate);

    // Reset mock functions
    mockCreatePortfolio.mockClear();
    mockPush.mockClear();
    toast.mockClear();

    // Trigger form submission
    await wrapper.find("form").trigger("submit");

    // Wait for the next tick to allow async operations to complete
    await vi.waitFor(() => {
      // Check if createPortfolio was called with the correct data
      expect(mockCreatePortfolio).toHaveBeenCalledWith({
        name: "Test Portfolio",
        description: "Test Description",
      });

      // Check if the router was used to navigate
      expect(mockPush).toHaveBeenCalledWith("/portfolios/test-portfolio");

      // Check if the toast notification was shown
      expect(toast).toHaveBeenCalledWith({
        title: "Portfolio Created",
        description: 'Your portfolio "Test Portfolio" has been created successfully.',
      });
    });
  });
});
