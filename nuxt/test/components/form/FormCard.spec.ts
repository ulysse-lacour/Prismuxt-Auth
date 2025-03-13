import FormCard from "@/components/form/FormCard.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it, vi } from "vitest";
import { h } from "vue";

/**
 * Mock modules before variable declarations to avoid hoisting issues
 */

// Mock the Card components
vi.mock("~/components/ui/card", () => {
  return {
    Card: {
      name: "Card",
      template: '<div class="card"><slot /></div>',
    },
    CardHeader: {
      name: "CardHeader",
      template: '<div class="card-header"><slot /></div>',
    },
    CardTitle: {
      name: "CardTitle",
      template: '<h2 class="card-title"><slot /></h2>',
    },
    CardDescription: {
      name: "CardDescription",
      template: '<p class="card-description"><slot /></p>',
    },
    CardContent: {
      name: "CardContent",
      template: '<div class="card-content"><slot /></div>',
    },
    CardFooter: {
      name: "CardFooter",
      template: '<div class="card-footer"><slot /></div>',
    },
  };
});

/**
 * FormCard Component Tests
 *
 * Tests for the FormCard component which is a wrapper around the Card component
 * with specific styling and layout for forms.
 */
describe("FormCard Component", () => {
  /**
   * Test to verify component renders with default props
   */
  it("renders with default props", async () => {
    const wrapper = await mountSuspended(FormCard, {
      props: {
        title: "Test Title",
      },
    });

    // Check if title is rendered
    expect(wrapper.find(".card-title").text()).toBe("Test Title");

    // Check if max-width class is applied with default value
    expect(wrapper.find(".card").attributes("class")).toContain("max-w-sm");

    // Check if description is not rendered when not provided
    expect(wrapper.find(".card-description").exists()).toBe(false);
  });

  /**
   * Test to verify component renders with custom props
   */
  it("renders with custom props", async () => {
    const wrapper = await mountSuspended(FormCard, {
      props: {
        title: "Custom Title",
        description: "Custom description",
        maxWidth: "max-w-md",
      },
    });

    // Check if title is rendered
    expect(wrapper.find(".card-title").text()).toBe("Custom Title");

    // Check if description is rendered
    expect(wrapper.find(".card-description").text()).toBe("Custom description");

    // Check if custom max-width class is applied
    expect(wrapper.find(".card").attributes("class")).toContain("max-w-md");
  });

  /**
   * Test to verify component renders slot content
   */
  it("renders slot content", async () => {
    const wrapper = await mountSuspended(FormCard, {
      props: {
        title: "Form Title",
      },
      slots: {
        default: () => h("div", { class: "test-content" }, "Form content"),
      },
    });

    // Check if slot content is rendered
    expect(wrapper.find(".test-content").exists()).toBe(true);
    expect(wrapper.find(".test-content").text()).toBe("Form content");
  });

  /**
   * Test to verify component renders footer slot when provided
   */
  it("renders footer slot when provided", async () => {
    const wrapper = await mountSuspended(FormCard, {
      props: {
        title: "Form Title",
      },
      slots: {
        footer: () => h("div", { class: "test-footer" }, "Footer content"),
      },
    });

    // Check if footer slot is rendered
    expect(wrapper.find(".card-footer").exists()).toBe(true);
    expect(wrapper.find(".test-footer").exists()).toBe(true);
    expect(wrapper.find(".test-footer").text()).toBe("Footer content");
  });

  /**
   * Test to verify component does not render footer when footer slot is not provided
   */
  it("does not render footer when footer slot is not provided", async () => {
    const wrapper = await mountSuspended(FormCard, {
      props: {
        title: "Form Title",
      },
    });

    // Check if footer is not rendered
    expect(wrapper.find(".card-footer").exists()).toBe(false);
  });
});
