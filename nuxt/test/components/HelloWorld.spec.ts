import HelloWorld from "@/components/HelloWorld.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";

describe("HelloWorld Component", () => {
  it("renders the message correctly", async () => {
    const wrapper = await mountSuspended(HelloWorld);
    expect(wrapper.text()).toContain("Hello, world!");
  });
});
