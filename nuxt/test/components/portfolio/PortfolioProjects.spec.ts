import PortfolioProjects from "@/components/portfolio/PortfolioProjects.vue";
import {
  mockComponent,
  mockNuxtImport,
  mountSuspended,
  registerEndpoint,
} from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import { computed, ref } from "vue";

// Mock modules before variable declarations to avoid hoisting issues
vi.mock("~/components/ui/toast", () => {
  return {
    toast: vi.fn(),
  };
});

// Mock the alert dialog components
vi.mock("~/components/ui/alert-dialog", () => {
  return {
    AlertDialog: {
      name: "AlertDialog",
      props: ["open"],
      template: '<div class="alert-dialog"><slot /></div>',
    },
    AlertDialogAction: {
      name: "AlertDialogAction",
      template: '<button class="alert-dialog-action"><slot /></button>',
    },
    AlertDialogCancel: {
      name: "AlertDialogCancel",
      template: '<button class="alert-dialog-cancel"><slot /></button>',
    },
    AlertDialogContent: {
      name: "AlertDialogContent",
      template: '<div class="alert-dialog-content"><slot /></div>',
    },
    AlertDialogDescription: {
      name: "AlertDialogDescription",
      template: '<div class="alert-dialog-description"><slot /></div>',
    },
    AlertDialogFooter: {
      name: "AlertDialogFooter",
      template: '<div class="alert-dialog-footer"><slot /></div>',
    },
    AlertDialogHeader: {
      name: "AlertDialogHeader",
      template: '<div class="alert-dialog-header"><slot /></div>',
    },
    AlertDialogTitle: {
      name: "AlertDialogTitle",
      template: '<div class="alert-dialog-title"><slot /></div>',
    },
  };
});

// Mock the button component
vi.mock("~/components/ui/button", () => {
  return {
    Button: {
      name: "Button",
      props: ["type", "variant", "size", "class", "disabled"],
      template:
        '<button class="button" :type="type" :class="[variant, size]" :disabled="disabled"><slot /></button>',
    },
  };
});

// Mock the combobox components
vi.mock("~/components/ui/combobox", () => {
  return {
    Combobox: {
      name: "Combobox",
      props: ["modelValue", "by", "disabled"],
      template: '<div class="combobox"><slot /></div>',
    },
    ComboboxAnchor: {
      name: "ComboboxAnchor",
      props: ["asChild"],
      template: '<div class="combobox-anchor"><slot /></div>',
    },
    ComboboxEmpty: {
      name: "ComboboxEmpty",
      template: '<div class="combobox-empty"><slot /></div>',
    },
    ComboboxGroup: {
      name: "ComboboxGroup",
      template: '<div class="combobox-group"><slot /></div>',
    },
    ComboboxInput: {
      name: "ComboboxInput",
      props: ["class", "placeholder"],
      template: '<input class="combobox-input" :placeholder="placeholder" />',
    },
    ComboboxItem: {
      name: "ComboboxItem",
      props: ["value"],
      template: '<div class="combobox-item"><slot /></div>',
    },
    ComboboxItemIndicator: {
      name: "ComboboxItemIndicator",
      template: '<div class="combobox-item-indicator"><slot /></div>',
    },
    ComboboxList: {
      name: "ComboboxList",
      template: '<div class="combobox-list"><slot /></div>',
    },
    ComboboxTrigger: {
      name: "ComboboxTrigger",
      props: ["asChild"],
      template: '<div class="combobox-trigger"><slot /></div>',
    },
  };
});

// Mock the form components
vi.mock("~/components/ui/form", () => {
  return {
    FormControl: {
      name: "FormControl",
      template: '<div class="form-control"><slot /></div>',
    },
    FormDescription: {
      name: "FormDescription",
      template: '<div class="form-description"><slot /></div>',
    },
    FormField: {
      name: "FormField",
      props: ["name"],
      template: '<div class="form-field"><slot /></div>',
    },
    FormItem: {
      name: "FormItem",
      props: ["class"],
      template: '<div class="form-item"><slot /></div>',
    },
    FormLabel: {
      name: "FormLabel",
      template: '<div class="form-label"><slot /></div>',
    },
    FormMessage: {
      name: "FormMessage",
      template: '<div class="form-message"><slot /></div>',
    },
  };
});

// Mock the lucide-vue-next icons
vi.mock("lucide-vue-next", () => {
  return {
    Check: {
      name: "Check",
      render: () => {},
    },
    ChevronsUpDown: {
      name: "ChevronsUpDown",
      render: () => {},
    },
    Edit: {
      name: "Edit",
      render: () => {},
    },
    Search: {
      name: "Search",
      render: () => {},
    },
    Trash: {
      name: "Trash",
      render: () => {},
    },
  };
});

// Mock vee-validate
vi.mock("vee-validate", () => {
  return {
    useForm: () => ({
      handleSubmit: (callback) => async () => {
        await callback({ relatedProject: "project-123" });
        return true;
      },
      setFieldValue: vi.fn(),
    }),
  };
});

// Mock NuxtLink
vi.mock("#components", () => {
  return {
    NuxtLink: {
      name: "NuxtLink",
      props: ["to"],
      template: '<a :href="to"><slot /></a>',
    },
  };
});

// Create mock functions and data
const mockSetCurrentPortfolio = vi.fn();
const mockUpdateCurrentPortfolio = vi.fn();
const mockProcessPortfolioData = vi.fn().mockImplementation((data) => data);

// Mock portfolio data
const mockPortfolioData = {
  portfolio: {
    id: "portfolio-123",
    name: "Test Portfolio",
    description: "Test Description",
    slug: "test-portfolio",
    portfolioProjects: [
      {
        id: "pp-1",
        project: {
          id: "project-1",
          name: "Project 1",
        },
      },
      {
        id: "pp-2",
        project: {
          id: "project-2",
          name: "Project 2",
        },
      },
    ],
  },
};

// Mock projects data
const mockProjectsData = [
  {
    id: "project-3",
    name: "Project 3",
    isLinked: false,
  },
  {
    id: "project-4",
    name: "Project 4",
    isLinked: false,
  },
  {
    id: "project-1",
    name: "Project 1",
    isLinked: true,
  },
];

// Mock the useRoute composable
mockNuxtImport("useRoute", () => {
  return () => ({
    params: {
      slug: "test-portfolio",
    },
    path: "/portfolios/test-portfolio",
  });
});

// Mock the useRouter composable
mockNuxtImport("useRouter", () => {
  return () => ({
    push: vi.fn(),
    replace: vi.fn(),
    resolve: vi.fn(() => ({ href: "/test" })),
  });
});

// Mock the useCurrentPortfolioStore composable
mockNuxtImport("useCurrentPortfolioStore", () => {
  return () => ({
    currentPortfolio: mockPortfolioData.portfolio,
    setCurrentPortfolio: mockSetCurrentPortfolio,
    updateCurrentPortfolio: mockUpdateCurrentPortfolio,
  });
});

// Mock the usePortfolioData composable
mockNuxtImport("usePortfolioData", () => {
  return () => ({
    processPortfolioData: mockProcessPortfolioData,
  });
});

// Mock useFetch for portfolio data
mockNuxtImport("useFetch", () => {
  return (url, options) => {
    if (url === "/api/portfolio/single") {
      return {
        data: ref(mockPortfolioData),
        refresh: vi.fn(),
      };
    } else if (url === "/api/portfolio/all-projects") {
      return {
        data: ref(mockProjectsData),
        refresh: vi.fn(),
      };
    }
    return {
      data: ref(null),
      refresh: vi.fn(),
    };
  };
});

// Register mock API endpoints
registerEndpoint("/api/portfolio/add-project", {
  method: "PUT",
  handler: () => {
    return {
      portfolio: mockPortfolioData.portfolio,
      message: "Project added successfully",
    };
  },
});

registerEndpoint("/api/portfolio/remove-project", {
  method: "PUT",
  handler: () => {
    return {
      portfolio: mockPortfolioData.portfolio,
      message: "Project removed successfully",
    };
  },
});

// Get the mocked toast function from the import
const { toast } = vi.mocked(await import("~/components/ui/toast"));

// Mock the DeleteConfirmDialog component
vi.mock("~/components/form/DeleteConfirmDialog", () => {
  return {
    default: defineComponent({
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
    }),
  };
});

describe("PortfolioProjects Component", () => {
  it("can be imported", () => {
    // This test just verifies that the component can be imported
    expect(PortfolioProjects).toBeDefined();
  });

  it("renders the current projects section", async () => {
    const wrapper = await mountSuspended(PortfolioProjects);

    // Check if the component renders the current projects section
    expect(wrapper.find("h2").text()).toBe("Current Projects");

    // Check if it renders the correct number of project cards
    const projectCards = wrapper.findAll(".flex.items-center.justify-between");
    expect(projectCards.length).toBe(2);

    // Check if project names are rendered
    expect(projectCards[0]?.find("h3").text()).toBe("Project 1");
    expect(projectCards[1]?.find("h3").text()).toBe("Project 2");

    // Check if edit and delete buttons are rendered for each project
    const buttons = wrapper.findAll(".button");
    expect(buttons.length).toBeGreaterThan(2); // At least 2 buttons per project
  });

  it("renders the add project form", async () => {
    const wrapper = await mountSuspended(PortfolioProjects);

    // Check if the add project form is rendered
    const formHeadings = wrapper.findAll("h2");
    expect(formHeadings.length).toBeGreaterThanOrEqual(2);
    expect(formHeadings[1]?.text()).toBe("Add Project to Portfolio");

    // Check if the form exists
    expect(wrapper.find("form").exists()).toBe(true);

    // Check if the combobox is rendered
    expect(wrapper.find(".combobox").exists()).toBe(true);

    // Check if the add button is rendered
    const addButton = wrapper
      .findAll(".button")
      .find((button) => button.text().includes("Add Project"));
    expect(addButton).toBeDefined();
  });

  it("submits the form to add a project", async () => {
    const wrapper = await mountSuspended(PortfolioProjects);

    // Reset mock functions
    mockSetCurrentPortfolio.mockClear();
    toast.mockClear();

    // Trigger form submission
    await wrapper.find("form").trigger("submit");

    // Wait for the next tick to allow async operations to complete
    await vi.waitFor(() => {
      // Check if the portfolio was updated in the store
      expect(mockSetCurrentPortfolio).toHaveBeenCalled();

      // Check if the toast notification was shown
      expect(toast).toHaveBeenCalledWith({
        title: "Project added successfully",
        description: "The project has been added to your portfolio.",
      });
    });
  });

  it("opens the delete dialog when delete button is clicked", async () => {
    const wrapper = await mountSuspended(PortfolioProjects);

    // Find the first delete button (Trash icon)
    const deleteButton = wrapper
      .findAll(".button")
      .find((button) => button.classes().includes("hover:bg-red-500"));

    // Click the delete button
    await deleteButton?.trigger("click");

    // Check if the alert dialog is rendered
    expect(wrapper.find(".alert-dialog").exists()).toBe(true);
    expect(wrapper.find(".alert-dialog-title").text()).toBe("Remove Project");

    // Check if the cancel and confirm buttons are rendered
    expect(wrapper.find(".alert-dialog-cancel").exists()).toBe(true);
    expect(wrapper.find(".alert-dialog-action").exists()).toBe(true);
  });
});
