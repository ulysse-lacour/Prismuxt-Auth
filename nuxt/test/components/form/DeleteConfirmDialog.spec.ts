import DeleteConfirmDialog from "@/components/form/DeleteConfirmDialog.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

// Define stub components
const stubs = {
  AlertDialog: {
    template: "<div><slot /></div>",
    props: ["open"],
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
      '<button data-test="confirm-button" class="alert-dialog-action" @click="$emit(\'click\')"><slot /></button>',
  },
  AlertDialogCancel: {
    template:
      '<button data-test="cancel-button" class="alert-dialog-cancel" @click="$emit(\'click\')"><slot /></button>',
  },
};

describe("DeleteConfirmDialog Component", () => {
  it("renders with default props when open", async () => {
    const wrapper = await mountSuspended(DeleteConfirmDialog, {
      props: {
        open: true,
      },
      global: {
        stubs,
      },
    });

    // Check if default title is rendered
    expect(wrapper.html()).toContain("Confirm Deletion");

    // Check if default description is rendered
    expect(wrapper.html()).toContain(
      "Are you sure you want to delete this item? This action cannot be undone."
    );

    // Check if default button texts are rendered
    expect(wrapper.html()).toContain("Delete");
    expect(wrapper.html()).toContain("Cancel");
  });

  it("renders with custom props", async () => {
    const wrapper = await mountSuspended(DeleteConfirmDialog, {
      props: {
        open: true,
        title: "Delete Project",
        description: "This will permanently remove the project",
        confirmText: "Yes, delete it",
        cancelText: "No, keep it",
        itemName: "My Project",
      },
      global: {
        stubs,
      },
    });

    // Check if custom title is rendered
    expect(wrapper.html()).toContain("Delete Project");

    // Check if custom description is rendered
    expect(wrapper.html()).toContain("This will permanently remove the project");

    // Check if custom button texts are rendered
    expect(wrapper.html()).toContain("Yes, delete it");
    expect(wrapper.html()).toContain("No, keep it");
  });

  it("uses itemName in default description when provided", async () => {
    const wrapper = await mountSuspended(DeleteConfirmDialog, {
      props: {
        open: true,
        itemName: "Test Item",
      },
      global: {
        stubs,
      },
    });

    // Check if description contains the item name
    expect(wrapper.html()).toContain(
      'Are you sure you want to delete "Test Item"? This action cannot be undone.'
    );
  });

  it("emits confirm event when confirm button is clicked", async () => {
    const wrapper = await mountSuspended(DeleteConfirmDialog, {
      props: {
        open: true,
      },
      global: {
        stubs,
      },
    });

    // Find and click the confirm button
    const confirmButton = wrapper.find("[data-test='confirm-button']");
    expect(confirmButton.exists()).toBe(true);

    await confirmButton.trigger("click");

    // Check if confirm event was emitted
    expect(wrapper.emitted("confirm")).toBeTruthy();

    // Check if update:open event was emitted with false value
    expect(wrapper.emitted("update:open")).toBeTruthy();
    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
  });

  it("emits cancel event when cancel button is clicked", async () => {
    const wrapper = await mountSuspended(DeleteConfirmDialog, {
      props: {
        open: true,
      },
      global: {
        stubs,
      },
    });

    // Find and click the cancel button
    const cancelButton = wrapper.find("[data-test='cancel-button']");
    expect(cancelButton.exists()).toBe(true);

    await cancelButton.trigger("click");

    // Check if cancel event was emitted
    expect(wrapper.emitted("cancel")).toBeTruthy();

    // Check if update:open event was emitted with false value
    expect(wrapper.emitted("update:open")).toBeTruthy();
    expect(wrapper.emitted("update:open")?.[0]).toEqual([false]);
  });

  it("emits update:open event when dialog is closed", async () => {
    const wrapper = await mountSuspended(DeleteConfirmDialog, {
      props: {
        open: true,
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
