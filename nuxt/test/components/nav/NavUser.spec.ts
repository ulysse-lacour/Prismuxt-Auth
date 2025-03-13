import NavUser from "@/components/nav/NavUser.vue";
import { describe, expect, it, vi } from "vitest";

// Mock all imports at the top level
vi.mock("@/components/ui/sidebar", () => ({}));
vi.mock("~/components/ui/dropdown-menu", () => ({}));
vi.mock("~/components/ui/avatar", () => ({}));
vi.mock("lucide-vue-next", () => ({}));
vi.mock("#components", () => ({}));

// Mock composables
vi.mock("#imports", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useSession: () => ({
    data: { value: { user: null, loggedIn: false } },
    signOut: vi.fn(),
  }),
  useUserDataStore: () => ({
    user: {},
    setUser: vi.fn(),
  }),
  useSidebar: () => ({
    toggleSidebar: vi.fn(),
    state: { value: "expanded" },
    isMobile: false,
  }),
  signOut: vi.fn(),
}));

describe("NavUser Component", () => {
  /**
   * Basic test to verify component can be imported
   */
  it("can be imported", () => {
    expect(NavUser).toBeDefined();
  });

  /**
   * Test to verify component has expected structure
   */
  it("has expected structure", () => {
    expect(NavUser).toHaveProperty("setup");
  });
});
