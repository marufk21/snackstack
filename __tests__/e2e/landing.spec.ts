import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("should load and show main heading", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/SnackStack/i);

    const mainHeading = page.getByRole("heading", { level: 1 });
    await expect(mainHeading).toBeVisible();
  });
});

