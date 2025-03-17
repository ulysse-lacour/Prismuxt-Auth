import ProjectCreate from "@/components/project/ProjectCreate.vue";
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
        await callback({
          name: "Test Project",
          description: "Test Description",
          client: "Test Client",
        });
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
const mockAddProject = vi.fn();
const mockPush = vi.fn();
const mockProcessProjectData = vi.fn().mockImplementation((data) => data);
const mockCreateProject = vi.fn().mockResolvedValue({
  createdProject: {
    project: {
      id: "project-123",
      name: "Test Project",
      description: "Test Description",
      client: "Test Client",
    },
    message: "Project created successfully",
  },
});

// Mock the useRouter composable
mockNuxtImport("useRouter", () => {
  return () => ({
    push: mockPush,
    replace: vi.fn(),
    resolve: vi.fn(() => ({ href: "/test" })),
  });
});

// Mock the useProjectData composable
mockNuxtImport("useProjectData", () => {
  return () => ({
    processProjectData: mockProcessProjectData,
  });
});

// Mock the useProjectStore composable
mockNuxtImport("useProjectStore", () => {
  return () => ({
    addProject: mockAddProject,
  });
});

// Mock the useProjectManagement composable
mockNuxtImport("useProjectManagement", () => {
  return () => ({
    createProject: mockCreateProject,
  });
});

// Register mock API endpoint
registerEndpoint("/api/project", {
  method: "POST",
  handler: () => {
    return {
      project: {
        id: "project-123",
        name: "Test Project",
        description: "Test Description",
        client: "Test Client",
      },
      message: "Project created successfully",
    };
  },
});

// Get the mocked toast function from the import
const { toast } = vi.mocked(await import("~/components/ui/toast"));

describe("ProjectCreate Component", () => {
  it("can be imported", () => {
    // This test just verifies that the component can be imported
    expect(ProjectCreate).toBeDefined();
  });

  it("renders the form with project fields", async () => {
    const wrapper = await mountSuspended(ProjectCreate);

    // Check if form exists
    expect(wrapper.find("form").exists()).toBe(true);

    // Check if the title is rendered
    expect(wrapper.find("h2").text()).toBe("Add project");

    // Check if labels are rendered
    const formLabels = wrapper.findAll(".form-label");
    expect(formLabels.length).toBe(3);
    expect(formLabels[0]?.text()).toBe("Name");
    expect(formLabels[1]?.text()).toBe("Client");
    expect(formLabels[2]?.text()).toBe("Description");

    // Check if input fields exist with correct attributes
    const inputs = wrapper.findAll(".input");
    expect(inputs.length).toBe(2);
    expect(inputs[0]?.attributes("type")).toBe("text");
    expect(inputs[0]?.attributes("placeholder")).toBe("Enter project name");
    expect(inputs[1]?.attributes("type")).toBe("text");
    expect(inputs[1]?.attributes("placeholder")).toBe("Enter client name");

    // Check if textarea exists with correct attributes
    const textarea = wrapper.find(".textarea");
    expect(textarea.exists()).toBe(true);
    expect(textarea.attributes("placeholder")).toBe("Enter project description");

    // Check if submit button exists
    const button = wrapper.find(".button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Create Project");
  });

  it("submits the form and creates a project", async () => {
    const wrapper = await mountSuspended(ProjectCreate);

    // Reset mock functions
    mockAddProject.mockClear();
    mockPush.mockClear();
    mockCreateProject.mockClear();
    toast.mockClear();

    // Trigger form submission
    await wrapper.find("form").trigger("submit");

    // Wait for the next tick to allow async operations to complete
    await vi.waitFor(() => {
      // Check if createProject was called with the correct data
      expect(mockCreateProject).toHaveBeenCalledWith({
        name: "Test Project",
        description: "Test Description",
        client: "Test Client",
      });

      // Check if the router was used to navigate
      expect(mockPush).toHaveBeenCalledWith("/projects/project-123");

      // Check if the toast notification was shown
      expect(toast).toHaveBeenCalledWith({
        title: "Project created",
        description: "Project created successfully",
      });
    });
  });
});
