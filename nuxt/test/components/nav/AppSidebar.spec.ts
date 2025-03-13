import AppSidebar from "@/components/nav/AppSidebar.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

// Mock the fetch API
vi.mock("nuxt/app", () => {
  return {
    useRoute: () => ({
      path: "/dashboard",
    }),
    useFetch: () => ({
      data: ref({
        user: {
          id: "user-1",
          name: "Test User",
          email: "test@example.com",
          projects: [
            { id: "project-1", name: "Test Project 1" },
            { id: "project-2", name: "Test Project 2" },
          ],
          portfolios: [
            { id: "portfolio-1", name: "Test Portfolio 1", slug: "test-portfolio-1" },
            { id: "portfolio-2", name: "Test Portfolio 2", slug: "test-portfolio-2" },
          ],
        },
      }),
    }),
  };
});

// Mock the composables
vi.mock("~/composables/useProjectData", () => ({
  useProjectData: () => ({
    processProjectData: (data) => data,
  }),
}));

vi.mock("~/composables/usePortfolioData", () => ({
  usePortfolioData: () => ({
    processPortfolioData: (data) => data,
  }),
}));

vi.mock("~/composables/useUserData", () => ({
  useUserData: () => ({
    processUserData: (data) => data,
  }),
}));

// Define stub components
const stubs = {
  Sidebar: {
    props: ["collapsible"],
    template:
      '<div class="sidebar" data-test="sidebar" :data-collapsible="collapsible"><slot /></div>',
  },
  SidebarContent: {
    template: '<div class="sidebar-content"><slot /></div>',
  },
  SidebarFooter: {
    template: '<div class="sidebar-footer"><slot /></div>',
  },
  SidebarHeader: {
    template: '<div class="sidebar-header"><slot /></div>',
  },
  SidebarTrigger: {
    template: '<button class="sidebar-trigger"><slot /></button>',
  },
  NavMain: {
    props: ["items"],
    template: '<div class="nav-main">NavMain Component</div>',
  },
  NavUser: {
    template: '<div class="nav-user">NavUser Component</div>',
  },
};

describe("AppSidebar Component", () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia());
  });

  it("renders the sidebar with correct structure", async () => {
    const wrapper = await mountSuspended(AppSidebar, {
      global: {
        stubs,
      },
    });

    // Check if sidebar components are rendered
    expect(wrapper.find('[data-test="sidebar"]').exists()).toBe(true);
    expect(wrapper.find(".sidebar-header").exists()).toBe(true);
    expect(wrapper.find(".sidebar-content").exists()).toBe(true);
    expect(wrapper.find(".sidebar-footer").exists()).toBe(true);
  });

  it("renders the NavMain component", async () => {
    const wrapper = await mountSuspended(AppSidebar, {
      global: {
        stubs,
      },
    });

    // Check if NavMain component is rendered
    expect(wrapper.find(".nav-main").exists()).toBe(true);
  });

  it("renders the NavUser component", async () => {
    const wrapper = await mountSuspended(AppSidebar, {
      global: {
        stubs,
      },
    });

    // Check if NavUser component is rendered
    expect(wrapper.find(".nav-user").exists()).toBe(true);
  });

  it("passes the correct props to the Sidebar component", async () => {
    const wrapper = await mountSuspended(AppSidebar, {
      props: {
        collapsible: "offcanvas",
      },
      global: {
        stubs,
      },
    });

    // Check if props are passed correctly
    const sidebar = wrapper.find('[data-test="sidebar"]');
    expect(sidebar.attributes("data-collapsible")).toBe("offcanvas");
  });
});
