import HelloWorld from "@/components/HelloWorld.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

/**
 * HelloWorld Component Tests
 *
 * Simple tests for the HelloWorld component to demonstrate basic testing patterns.
 */
describe("HelloWorld Component", () => {
  /**
   * Test to verify component renders the message correctly
   */
  it("renders the message correctly", async () => {
    // Mount the component
    const wrapper = await mountSuspended(HelloWorld);

    // Check if the expected message is rendered
    expect(wrapper.text()).toContain("Hello, world!");
  });

  /**
   * Test to verify component structure
   */
  it("has the expected structure", async () => {
    const wrapper = await mountSuspended(HelloWorld);

    // Check if the component has a paragraph
    expect(wrapper.find("p").exists()).toBe(true);
    expect(wrapper.find("p").text()).toBe("Hello, world!");
  });
});
