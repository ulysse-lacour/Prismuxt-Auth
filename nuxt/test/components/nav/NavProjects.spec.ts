import NavProjects from "@/components/nav/NavProjects.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";

// Mock all imports at the top level
vi.mock("@/components/ui/sidebar", () => ({
  SidebarGroup: {
    name: "SidebarGroup",
    template: '<div class="sidebar-group"><slot /></div>',
  },
  SidebarGroupLabel: {
    name: "SidebarGroupLabel",
    template: '<div class="sidebar-group-label"><slot /></div>',
  },
  SidebarMenu: {
    name: "SidebarMenu",
    template: '<div class="sidebar-menu"><slot /></div>',
  },
  SidebarMenuAction: {
    name: "SidebarMenuAction",
    props: ["showOnHover"],
    template: '<div class="sidebar-menu-action"><slot /></div>',
  },
  SidebarMenuButton: {
    name: "SidebarMenuButton",
    props: ["asChild", "class"],
    template: '<div class="sidebar-menu-button"><slot /></div>',
  },
  SidebarMenuItem: {
    name: "SidebarMenuItem",
    template: '<div class="sidebar-menu-item"><slot /></div>',
  },
  useSidebar: () => ({
    isMobile: false,
  }),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: {
    name: "DropdownMenu",
    template: '<div class="dropdown-menu"><slot /></div>',
  },
  DropdownMenuContent: {
    name: "DropdownMenuContent",
    props: ["side", "align", "class"],
    template: '<div class="dropdown-menu-content"><slot /></div>',
  },
  DropdownMenuItem: {
    name: "DropdownMenuItem",
    template: '<div class="dropdown-menu-item"><slot /></div>',
  },
  DropdownMenuSeparator: {
    name: "DropdownMenuSeparator",
    template: '<div class="dropdown-menu-separator"></div>',
  },
  DropdownMenuTrigger: {
    name: "DropdownMenuTrigger",
    props: ["asChild"],
    template: '<div class="dropdown-menu-trigger"><slot /></div>',
  },
}));

vi.mock("lucide-vue-next", () => ({
  Folder: {
    name: "Folder",
    render: () => {},
  },
  Forward: {
    name: "Forward",
    render: () => {},
  },
  MoreHorizontal: {
    name: "MoreHorizontal",
    render: () => {},
  },
  Trash2: {
    name: "Trash2",
    render: () => {},
  },
}));

describe("NavProjects Component", () => {
  /**
   * Basic test to verify component can be imported
   */
  it("can be imported", () => {
    expect(NavProjects).toBeDefined();
  });

  /**
   * Test to verify component has expected structure
   */
  it("has expected structure", () => {
    expect(NavProjects).toHaveProperty("props");
  });

  /**
   * Test to verify component renders projects correctly
   */
  it("renders projects correctly", async () => {
    // Mock projects data
    const projects = [
      {
        name: "Project 1",
        url: "/projects/1",
        icon: vi.fn(),
      },
      {
        name: "Project 2",
        url: "/projects/2",
        icon: vi.fn(),
      },
    ];

    // Mount component with props
    const wrapper = await mountSuspended(NavProjects, {
      props: {
        projects,
      },
    });

    // Check if the component renders the projects section
    expect(wrapper.find(".sidebar-group").exists()).toBe(true);
    expect(wrapper.find(".sidebar-group-label").text()).toBe("Projects");

    // Check if it renders the correct number of project items
    const menuItems = wrapper.findAll(".sidebar-menu-item");
    // Projects + "More" button
    expect(menuItems.length).toBe(projects.length + 1);

    // Check if project names are rendered
    const projectTexts = wrapper.findAll(".sidebar-menu-button");
    expect(projectTexts[0]?.text()).toContain("Project 1");
    expect(projectTexts[1]?.text()).toContain("Project 2");
  });

  /**
   * Test to verify dropdown menus are rendered for each project
   */
  it("renders dropdown menus for each project", async () => {
    // Mock projects data
    const projects = [
      {
        name: "Project 1",
        url: "/projects/1",
        icon: vi.fn(),
      },
    ];

    // Mount component with props
    const wrapper = await mountSuspended(NavProjects, {
      props: {
        projects,
      },
    });

    // Check if dropdown menus are rendered
    expect(wrapper.findAll(".dropdown-menu").length).toBe(projects.length);

    // Check if dropdown menu items are rendered
    expect(wrapper.findAll(".dropdown-menu-item").length).toBe(3); // View, Share, Delete

    // Check if dropdown menu separator is rendered
    expect(wrapper.find(".dropdown-menu-separator").exists()).toBe(true);
  });
});
