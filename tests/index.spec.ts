require('dotenv').config();
import { expect, Page } from '@playwright/test';
import { loadPage } from './libs/load-page';
import { newPage } from './libs/page-logic';
import { test } from './libs/playwright';
import { createWorkspace } from './libs/workspace-logic';
import fs from 'fs';
import path from 'path';
import { scanDirs } from 'libs/file-logic';
loadPage();
const token = process.env.token;
let SYNC_CLOUD_TIME = 5000;
test.describe('create cloud workspace by different ways of importing ', () => {
  test('import by markdowns', async ({ page }) => {
    console.log(page.url());

    await passAuth(_page);
    console.log('passAuth success');

    await createWorkspace(
      { name: process.env.BLOG_NAME || 'AFFiNE-ghost' },
      page
    );

    await batchCreatePagesByNotes(page);
    console.log('batchCreatePagesByNotes success');

    await enableCloud(page);
    console.log('enableCloud success');
  });
});

const passAuth = async (_page: Page) => {
  // open login modal
  await _page.getByTestId('workspace-name').click();

  //check unlogin
  expect(await _page.locator('Sign in AFFiNE Cloud')).not.toBeNull();

  const affineLogin = await _page.evaluate(
    function (o) {
      window.localStorage.setItem('affine:login', o.token || '');
    },
    { token }
  );
  await _page.reload();

  await _page.waitForTimeout(3000);

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
const batchCreatePagesByNotes = async (_page: Page) => {
  const filesList = scanDirs('./notes').filesList;
  SYNC_CLOUD_TIME = filesList.length * 5000 + 5000;
  for (let i = 0; i < filesList.length; i++) {
    const file = filesList[i];
    const pageContent = fs.readFileSync(path.join('./notes', file), 'utf-8');
    const pageTitle = file;
    await createPage(_page, pageTitle, pageContent);
  }
};
