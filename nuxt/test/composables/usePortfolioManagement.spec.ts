import { describe, expect, it } from "vitest";

import { usePortfolioManagement } from "../../app/composables/usePortfolioManagement";

/**
 * usePortfolioManagement Composable Tests
 *
 * Basic test to verify the composable can be imported
 */
describe("usePortfolioManagement Composable", () => {
  it("can be imported", () => {
    expect(usePortfolioManagement).toBeDefined();
  });
});
