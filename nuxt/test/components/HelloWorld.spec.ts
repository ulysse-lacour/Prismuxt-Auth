import HelloWorld from "@/components/HelloWorld.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

/**
 * HelloWorld Component Tests
 *
 * Simple tests for the HelloWorld component to demonstrate basic testing patterns.
 * These tests verify the component's rendering, structure, and styling.
 */
describe("HelloWorld Component", () => {
  /**
   * Test to verify component can be imported
   */
  it("can be imported", () => {
    expect(HelloWorld).toBeDefined();
  });

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

  /**
   * Test to verify component styling
   */
  it("applies the correct styling classes", async () => {
    const wrapper = await mountSuspended(HelloWorld);

    // Check if the paragraph has the expected classes
    const paragraph = wrapper.find("p");
    expect(paragraph.classes()).toContain("text-lg");

    // Check if the component has a container with appropriate styling
    const container = wrapper.find("div");
    expect(container.exists()).toBe(true);
    expect(container.classes()).toContain("p-4");
  });

  /**
   * Test to verify component props handling
   */
  it("renders custom message when provided", async () => {
    // Mount the component with a custom message prop
    const customMessage = "Custom greeting!";
    const wrapper = await mountSuspended(HelloWorld, {
      props: {
        message: customMessage,
      },
    });

    // Check if the custom message is rendered
    expect(wrapper.text()).toContain(customMessage);
    expect(wrapper.find("p").text()).toBe(customMessage);
  });
});
