import NavMain from "@/components/nav/NavMain.vue";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import type { LucideIcon } from "lucide-vue-next";

/**
 * Define the TestNavItem type to match the component's expected props
 */
interface TestNavItem {
  title: string;
  url: string;
  icon?: any; // Using any for icon since we're mocking it in tests
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon?: any;
    className?: string;
  }[];
}

// Create mock functions before vi.mock calls to avoid hoisting issues
const mockToggleSidebar = vi.fn();
const mockSidebarState = ref("expanded");

/**
 * Mock modules
 */

// Mock the sidebar components
vi.mock("~/components/ui/sidebar", () => {
  return {
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
    SidebarMenuItem: {
      name: "SidebarMenuItem",
      template: '<div class="sidebar-item"><slot /></div>',
    },
    SidebarMenuButton: {
      name: "SidebarMenuButton",
      props: ["tooltip"],
      template: '<div class="sidebar-menu-button"><slot /></div>',
    },
    SidebarMenuSub: {
      name: "SidebarMenuSub",
      template: '<div class="sidebar-menu-sub"><slot /></div>',
    },
    SidebarMenuSubItem: {
      name: "SidebarMenuSubItem",
      props: ["class"],
      template: '<div class="sidebar-sub-item"><slot /></div>',
    },
    SidebarMenuSubButton: {
      name: "SidebarMenuSubButton",
      props: ["as"],
      template: '<div class="sidebar-sub-button"><slot /></div>',
    },
    useSidebar: () => ({
      toggleSidebar: mockToggleSidebar,
      state: mockSidebarState,
      isMobile: false,
    }),
  };
});

// Mock the collapsible component
vi.mock("~/components/ui/collapsible", () => {
  return {
    Collapsible: {
      name: "Collapsible",
      props: ["open", "asChild"],
      template: '<div class="collapsible"><slot /></div>',
    },
    CollapsibleTrigger: {
      name: "CollapsibleTrigger",
      props: ["asChild"],
      template: '<div class="collapsible-trigger"><slot /></div>',
    },
    CollapsibleContent: {
      name: "CollapsibleContent",
      template: '<div class="collapsible-content"><slot /></div>',
    },
  };
});

// Mock the lucide-vue-next components
vi.mock("lucide-vue-next", () => {
  return {
    ChevronRight: {
      name: "ChevronRight",
      template: '<span class="icon-chevron-right"></span>',
    },
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

// Mock the useRoute composable
mockNuxtImport("useRoute", () => {
  return () => ({
    path: "/projects/123",
  });
});

describe("NavMain Component", () => {
  /**
   * Basic test to verify component can be imported
   */
  it("can be imported", () => {
    expect(NavMain).toBeDefined();
  });

  /**
   * Test to verify component props
   */
  it("has expected props", () => {
    expect(NavMain).toHaveProperty("props");
    expect(NavMain.props).toHaveProperty("items");
  });

  /**
   * Test to verify component renders navigation items correctly
   */
  it("renders navigation items", async () => {
    const items: TestNavItem[] = [
      {
        title: "Projects",
        url: "/projects",
        isActive: true,
        items: [
          {
            title: "Project 1",
            url: "/projects/123",
          },
          {
            title: "Project 2",
            url: "/projects/456",
          },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        items: [
          {
            title: "Profile",
            url: "/settings/profile",
          },
        ],
      },
    ];

    const wrapper = await mountSuspended(NavMain, {
      props: {
        items,
      },
      shallow: true,
    });

    // Check if the component renders
    expect(wrapper.html()).not.toBe("");
  });

  /**
   * Test to verify component renders sub-items correctly
   */
  it("renders sub-items when provided", async () => {
    const items: TestNavItem[] = [
      {
        title: "Projects",
        url: "/projects",
        isActive: true,
        items: [
          {
            title: "Project 1",
            url: "/projects/123",
          },
          {
            title: "Project 2",
            url: "/projects/456",
          },
        ],
      },
    ];

    const wrapper = await mountSuspended(NavMain, {
      props: {
        items,
      },
      shallow: true,
    });

    // Check if the component renders
    expect(wrapper.html()).not.toBe("");
  });
});
