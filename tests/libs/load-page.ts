import { test } from '@playwright/test';
import type { Page } from '@playwright/test';

interface IType {
  page: Page;
}
export function loadPage() {
  test.beforeEach(async ({ page }: IType) => {
    console.log(process.env.AFFiNE_APP_URL);
    await page.goto(process.env.AFFiNE_APP_URL);

    // waiting for page loading end
    await page.waitForSelector('#__next');
    await page.waitForTimeout(2000);
  });
}
