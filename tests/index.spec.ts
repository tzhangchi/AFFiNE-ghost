require('dotenv').config();
import { expect, Page } from '@playwright/test';
import fs from 'fs';

import { removePrefixOfFileList, scanDirs } from './libs/file-logic';
import { loadPage } from './libs/load-page';
import { newPage } from './libs/page-logic';
import { test } from './libs/playwright';
import { createWorkspace } from './libs/workspace-logic';
loadPage();
const AFFiNE_LOGIN_TOEKN = process.env.AFFiNE_LOGIN_TOEKN;
let SYNC_CLOUD_TIME = 5000;
test.describe('create cloud workspace by different ways of importing ', () => {
  test('import by markdowns', async ({ page }) => {
    console.log(page.url());

    await passAuth(page);
    console.log('passAuth success');

    await createWorkspace(
      {
        name:
          process.env.AFFiNE_WORKSPACE_NAME ||
          (process.env.AFFiNE_LOCAL_SOURCE_PATH &&
            process.env.AFFiNE_LOCAL_SOURCE_PATH.split('/').reverse()[0]) ||
          'AFFiNE-ghost',
      },
      page
    );

    await batchCreatePagesByNotes(page);
    console.log('batchCreatePagesByNotes success');

    await enableCloudAndPublic(page);
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
    { token: AFFiNE_LOGIN_TOEKN }
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

const enableCloudAndPublic = async (_page: Page) => {
  await _page.getByRole('link', { name: 'Settings' }).click();
  await _page.getByText('Collaboration').click();
  await _page.getByRole('button', { name: 'Enable AFFiNE Cloud' }).click();
  await _page.getByRole('button', { name: 'Enable' }).click();
  await _page.waitForTimeout(SYNC_CLOUD_TIME);

  await _page.getByRole('link', { name: 'Settings' }).click();
  await _page.getByText('Publish').click();
  await _page.getByRole('button', { name: 'Publish to web' }).click();

  console.log(
    'enableCloudAndPublic success ' + _page.getByRole('textbox').textContent()
  );
};
const batchCreatePagesByNotes = async (_page: Page) => {
  const sourcePath = process.env.AFFiNE_LOCAL_SOURCE_PATH || './notes';
  const fileList = scanDirs(sourcePath).fileList;
  const pageTiles: string[] = removePrefixOfFileList(fileList, sourcePath);
  // const supppoertedFileTypes = ['.md', '.markdown', '.mdown', '.mkdn'];
  SYNC_CLOUD_TIME = fileList.length * 5000 + 5000;
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i] as string;
    if (!file.includes('.md')) {
      continue;
    }
    const pageContent = fs.readFileSync(file, 'utf-8');
    const pageTitle = pageTiles[i];
    await createPage(_page, pageTitle, pageContent);
  }
};
