import { expect, test } from "@playwright/test";

test("home page renders core sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "2026 除夕许愿墙" })).toBeVisible();
  await expect(page.getByText("距离放飞", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "写愿望" })).toBeVisible();
});
