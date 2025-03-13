import PasswordInput from "@/components/form/PasswordInput.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

describe("PasswordInput Component", () => {
  it("renders with default props", async () => {
    const wrapper = await mountSuspended(PasswordInput, {
      props: {
        modelValue: "",
      },
    });

    // Check if label is rendered with default text
    expect(wrapper.find("label").exists()).toBe(true);
    expect(wrapper.find("label").text()).toBe("Password");

    // Check if input has correct attributes
    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
    expect(input.attributes("type")).toBe("password");
    expect(input.attributes("placeholder")).toBe("Enter your password");
    expect(input.attributes("required")).toBe("");

    // Check if toggle button exists
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("renders with custom props", async () => {
    const wrapper = await mountSuspended(PasswordInput, {
      props: {
        modelValue: "testpassword",
        id: "custom-password",
        placeholder: "Custom placeholder",
        required: false,
        label: "Custom Label",
      },
    });

    // Check if custom label is rendered
    expect(wrapper.find("label").text()).toBe("Custom Label");

    // Check if input has custom attributes
    const input = wrapper.find("input");
    expect(input.attributes("id")).toBe("custom-password");
    expect(input.attributes("placeholder")).toBe("Custom placeholder");
    expect(input.attributes("required")).toBeUndefined();

    // Check if the value is correctly bound by checking the prop
    expect(wrapper.props("modelValue")).toBe("testpassword");
  });

  it("toggles password visibility when button is clicked", async () => {
    const wrapper = await mountSuspended(PasswordInput, {
      props: {
        modelValue: "testpassword",
      },
    });

    // Initially password should be hidden
    expect(wrapper.find("input").attributes("type")).toBe("password");

    // Click the toggle button
    await wrapper.find("button").trigger("click");

    // Password should now be visible
    expect(wrapper.find("input").attributes("type")).toBe("text");

    // Click the toggle button again
    await wrapper.find("button").trigger("click");

    // Password should be hidden again
    expect(wrapper.find("input").attributes("type")).toBe("password");
  });

  it("emits update:modelValue event when input changes", async () => {
    const wrapper = await mountSuspended(PasswordInput, {
      props: {
        modelValue: "",
      },
    });

    // Simulate input change
    await wrapper.find("input").setValue("newpassword");

    // Check if update:modelValue event was emitted with correct value
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["newpassword"]);
  });

  it("shows forgot password link when forgotPasswordLink prop is true", async () => {
    const wrapper = await mountSuspended(PasswordInput, {
      props: {
        modelValue: "",
        forgotPasswordLink: true,
      },
    });

    // Check if forgot password link is rendered
    const link = wrapper.find("a");
    expect(link.exists()).toBe(true);
    expect(link.text()).toContain("Forgot your password?");
    expect(link.attributes("href")).toBe("/auth/forget-password");
  });

  it("hides label when noLabel prop is true", async () => {
    const wrapper = await mountSuspended(PasswordInput, {
      props: {
        modelValue: "",
        noLabel: true,
      },
    });

    // Check if label is not rendered
    expect(wrapper.find("label").exists()).toBe(false);
  });
});
