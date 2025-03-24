import { describe, expect, it } from "vitest";

import { useProjectManagement } from "../../app/composables/useProjectManagement";

/**
 * useProjectManagement Composable Tests
 *
 * Basic test to verify the composable can be imported
 */
describe("useProjectManagement Composable", () => {
  it("can be imported", () => {
    expect(useProjectManagement).toBeDefined();
  });
});
