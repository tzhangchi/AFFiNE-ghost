require('dotenv').config();
import { expect, Page } from '@playwright/test';
import { loadPage } from './libs/load-page';
import { newPage } from './libs/page-logic';
import { test } from './libs/playwright';
import { createWorkspace } from './libs/workspace-logic';
import fs from 'fs';
import path from 'path';
loadPage();
const token = process.env.token;
let SYNC_CLOUD_TIME = 5000;
test.describe('create cloud workspace by different ways of importing ', () => {
  test('import by markdowns', async ({ page }) => {
    const passAuth = async () => {
      // open login modal
      await page.getByTestId('workspace-name').click();

      //check unlogin
      expect(await page.locator('Sign in AFFiNE Cloud')).not.toBeNull();

      const affineLogin = await page.evaluate(
        function (o) {
          window.localStorage.setItem('affine:login', o.token);
        },
        { token }
      );
      await page.reload();

      await page.waitForTimeout(3000);

      // //check login
      // expect(await page.getByText('zhangchi.page')).not.toBeNull();
    };

    const createPage = async (_page: Page, title: string, content: string) => {
      await newPage(_page);
      await _page.getByPlaceholder('Title').click();
      await _page.getByPlaceholder('Title').fill(title);
      await _page.getByRole('paragraph').click();
      await _page.getByRole('paragraph').fill(content);
    };

    const enableCloud = async (_page: Page) => {
      await _page.getByRole('link', { name: 'Settings' }).click();
      await _page.getByText('Collaboration').click();
      await _page.getByRole('button', { name: 'Enable AFFiNE Cloud' }).click();
      await _page.getByRole('button', { name: 'Enable' }).click();
      await _page.waitForTimeout(SYNC_CLOUD_TIME);
    };

    console.log(page.url());

    await passAuth();
    console.log('passAuth success');

    const batchCreatePagesByNotes = async (_page: Page) => {
      const files = fs.readdirSync('./notes');
      SYNC_CLOUD_TIME = files.length * 5000 + 5000;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const content = fs.readFileSync(path.join('./notes', file), 'utf-8');
        await createPage(page, file, content);
      }
      // await createPage(page, 'this is a new page', 'dsfadfadfs');
    };
    await createWorkspace({ name: process.env.BLOG_NAME }, page);

    await batchCreatePagesByNotes(page);
    console.log('batchCreatePagesByNotes success');

    await enableCloud(page);
    console.log('enableCloud success');
  });
});
