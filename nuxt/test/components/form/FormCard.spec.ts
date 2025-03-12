import FormCard from "@/components/form/FormCard.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import { h } from "vue";

// Define stub components
const stubs = {
  Card: {
    template: '<div class="card"><slot /></div>',
  },
  CardHeader: {
    template: '<div class="card-header"><slot /></div>',
  },
  CardTitle: {
    template: '<h2 class="card-title"><slot /></h2>',
  },
  CardDescription: {
    template: '<p class="card-description"><slot /></p>',
  },
  CardContent: {
    template: '<div class="card-content"><slot /></div>',
  },
  CardFooter: {
    template: '<div class="card-footer"><slot /></div>',
  },
};

describe("FormCard Component", () => {
  it("renders with default props", async () => {
    const wrapper = await mountSuspended(FormCard, {
      props: {
        title: "Test Title",
      },
      global: {
        stubs,
      },
    });

    // Check if title is rendered
    expect(wrapper.find(".card-title").text()).toBe("Test Title");

    // Check if max-width class is applied with default value
    expect(wrapper.find(".card").attributes("class")).toContain("max-w-sm");

    // Check if description is not rendered when not provided
    expect(wrapper.find(".card-description").exists()).toBe(false);
  });

  it("renders with custom props", async () => {
    const wrapper = await mountSuspended(FormCard, {
      props: {
        title: "Custom Title",
        description: "Custom description",
        maxWidth: "max-w-md",
      },
      global: {
        stubs,
      },
    });

    // Check if title is rendered
    expect(wrapper.find(".card-title").text()).toBe("Custom Title");

    // Check if description is rendered
    expect(wrapper.find(".card-description").text()).toBe("Custom description");

    // Check if custom max-width class is applied
    expect(wrapper.find(".card").attributes("class")).toContain("max-w-md");
  });

  it("renders slot content", async () => {
    const wrapper = await mountSuspended(FormCard, {
      props: {
        title: "Form Title",
      },
      slots: {
        default: () => h("div", { class: "test-content" }, "Form content"),
      },
      global: {
        stubs,
      },
    });

    // Check if slot content is rendered
    expect(wrapper.find(".test-content").exists()).toBe(true);
    expect(wrapper.find(".test-content").text()).toBe("Form content");
  });

  it("renders footer slot when provided", async () => {
    const wrapper = await mountSuspended(FormCard, {
      props: {
        title: "Form Title",
      },
      slots: {
        footer: () => h("div", { class: "test-footer" }, "Footer content"),
      },
      global: {
        stubs,
      },
    });

    // Check if footer slot is rendered
    expect(wrapper.find(".card-footer").exists()).toBe(true);
    expect(wrapper.find(".test-footer").exists()).toBe(true);
    expect(wrapper.find(".test-footer").text()).toBe("Footer content");
  });

  it("does not render footer when footer slot is not provided", async () => {
    const wrapper = await mountSuspended(FormCard, {
      props: {
        title: "Form Title",
      },
      global: {
        stubs,
      },
    });

    // Check if footer is not rendered
    expect(wrapper.find(".card-footer").exists()).toBe(false);
  });
});
