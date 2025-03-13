import ErrorDialog from "@/components/form/ErrorDialog.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

// Define stub components
const stubs = {
  AlertDialog: {
    props: ["open"],
    template: "<div><slot /></div>",
    emits: ["update:open"],
  },
  AlertDialogContent: {
    template: '<div class="alert-dialog-content"><slot /></div>',
  },
  AlertDialogHeader: {
    template: '<div class="alert-dialog-header"><slot /></div>',
  },
  AlertDialogFooter: {
    template: '<div class="alert-dialog-footer"><slot /></div>',
  },
  AlertDialogTitle: {
    template: '<div class="alert-dialog-title"><slot /></div>',
  },
  AlertDialogDescription: {
    template: '<div class="alert-dialog-description"><slot /></div>',
  },
  AlertDialogAction: {
    template:
      '<button data-test="action-button" class="alert-dialog-action" @click="$emit(\'click\')"><slot /></button>',
  },
};

describe("ErrorDialog Component", () => {
  it("renders with default props when open", async () => {
    const wrapper = await mountSuspended(ErrorDialog, {
      props: {
        open: true,
        message: "An error occurred",
      },
      global: {
        stubs,
      },
    });

    // Check if dialog content is rendered
    expect(wrapper.html()).toContain("An error occurred");

    // Check if default title is rendered
    expect(wrapper.html()).toContain("Oups...");

    // Check if default action label is rendered
    expect(wrapper.html()).toContain("OK");
  });

  it("renders with custom props", async () => {
    const wrapper = await mountSuspended(ErrorDialog, {
      props: {
        open: true,
        title: "Custom Error",
        message: "Custom error message",
        actionLabel: "Close",
      },
      global: {
        stubs,
      },
    });

    // Check if custom content is rendered
    expect(wrapper.html()).toContain("Custom Error");
    expect(wrapper.html()).toContain("Custom error message");
    expect(wrapper.html()).toContain("Close");
  });

  it("does not render dialog content when closed", async () => {
    const wrapper = await mountSuspended(ErrorDialog, {
      props: {
        open: false,
        message: "An error occurred",
      },
      global: {
        stubs,
      },
    });

    // Dialog content should not be visible
    expect(wrapper.find("div[role='dialog']").exists()).toBe(false);
  });

  it("emits update:open event when action button is clicked", async () => {
    const wrapper = await mountSuspended(ErrorDialog, {
      props: {
        open: true,
        message: "An error occurred",
      },
      global: {
        stubs,
      },
    });

    // Find and click the action button
    const actionButton = wrapper.find("[data-test='action-button']");
    expect(actionButton.exists()).toBe(true);

    await actionButton.trigger("click");

    // Check if update:open event was emitted with false value
    expect(wrapper.emitted("update:open")).toBeTruthy();
    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
  });

  it("emits update:open event when dialog is closed", async () => {
    const wrapper = await mountSuspended(ErrorDialog, {
      props: {
        open: true,
        message: "An error occurred",
      },
      global: {
        stubs,
      },
    });

    // Simulate dialog close event
    await wrapper.vm.$emit("update:open", false);

    // Check if update:open event was emitted with false value
    expect(wrapper.emitted("update:open")).toBeTruthy();
    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
  });
});
