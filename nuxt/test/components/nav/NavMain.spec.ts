// Import the component directly
import NavMain from "@/components/nav/NavMain.vue";
import { describe, expect, it } from "vitest";

describe("NavMain Component", () => {
  it("can be imported", () => {
    // This test just verifies that the component can be imported
    expect(NavMain).toBeDefined();
  });

  it("has expected props", () => {
    // This test verifies that the component has the expected props
    expect(NavMain).toHaveProperty("props");
    expect(NavMain.props).toHaveProperty("items");
  });
});
