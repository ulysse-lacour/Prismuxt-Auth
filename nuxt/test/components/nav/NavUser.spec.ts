// Import the component directly
import NavUser from "@/components/nav/NavUser.vue";
import { describe, expect, it } from "vitest";

describe("NavUser Component", () => {
  it("can be imported", () => {
    // This test just verifies that the component can be imported
    expect(NavUser).toBeDefined();
  });

  it("has expected structure", () => {
    // This test verifies that the component has the expected structure
    expect(NavUser).toHaveProperty("setup");
  });
});
