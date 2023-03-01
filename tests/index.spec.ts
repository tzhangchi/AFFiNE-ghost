require('dotenv').config();
import { expect, Page } from '@playwright/test';
import fs from 'fs';

import { removePrefixOfFileList, scanDirs } from './libs/file-logic';
import { loadPage } from './libs/load-page';
import { newPage } from './libs/page-logic';
import { test } from './libs/playwright';
import { createWorkspace } from './libs/workspace-logic';
loadPage();
const AFFiNE_LOGIN_TOKEN = process.env.AFFiNE_LOGIN_TOKEN;
let SYNC_CLOUD_TIME = 2500;
test.describe('create cloud workspace by different ways of importing ', () => {
  test('import by markdowns', async ({ page }) => {
    await page.waitForTimeout(2000);
    console.log(page.url());

    await passAuth(page);
    console.log('[info] passAuth success');

    // await page.getByTestId('workspace-name').click();
    // await page.waitForTimeout(2000);
    // await page.getByText('Hi, Developers').click();

    const newWorkspaceName =
      process.env.AFFiNE_WORKSPACE_NAME ||
      (process.env.AFFiNE_LOCAL_SOURCE_PATH &&
        process.env.AFFiNE_LOCAL_SOURCE_PATH.split('/').reverse()[0]) ||
      'AFFiNE-ghost';
    await createWorkspace(
      {
        name: newWorkspaceName,
      },
      page
    );
    console.log(`[info] createWorkspace [${newWorkspaceName}] success `);
    await page.waitForTimeout(2000);

    console.log(page.url());

    await batchCreatePagesByNotes(page);

    await enableCloudAndPublic(page);
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
    { token: AFFiNE_LOGIN_TOKEN }
  );
  await _page.reload();

  await _page.waitForTimeout(3000);

  // check login success, if error here, please check your token
  // await _page.getByTestId('workspace-name').click();
  // await _page.waitForTimeout(1000);
  // expect(await _page.locator('Sign in AFFiNE Cloud')).not.toBeDefined();
};

const createPage = async (_page: Page, title: string, content: string) => {
  await newPage(_page);
  await _page.getByPlaceholder('Title').click();
  await _page.getByPlaceholder('Title').fill(title);
  await _page.getByRole('paragraph').click();

  // await _page.getByRole('paragraph').fill(content);
  const editorImportMakrdown = await _page.evaluate(
    function (o) {
      const editor = window.document.querySelector('editor-container');
      const frameId = editor.model[0].children[0].id;
      editor.__clipboard.importMarkdown(o.content, frameId);
    },
    { content: content }
  );
};

const enableCloudAndPublic = async (_page: Page) => {
  await _page.getByTestId('sliderBar').click();
  await _page.getByRole('link', { name: 'Settings' }).click();
  await _page.getByText('Collaboration').click();
  await _page.getByRole('button', { name: 'Enable AFFiNE Cloud' }).click();
  await _page.getByRole('button', { name: 'Enable' }).click();

  await _page.waitForTimeout(SYNC_CLOUD_TIME);

  console.log('[info] enableCloud success');

  console.log(_page.url());

  await _page.getByRole('link', { name: 'Settings' }).click();
  await _page.getByText('Publish', { exact: true }).click();
  await _page.getByRole('button', { name: 'Publish to web' }).click();
  await _page.waitForTimeout(5000);
  console.log(_page.url());
  console.log(
    '[info] enableCloudAndPublic success ' +
      _page
        .url()
        .replace('workspace', 'public-workspace')
        .replace('/setting', '')
  );
};
const batchCreatePagesByNotes = async (_page: Page) => {
  const sourcePath = process.env.AFFiNE_LOCAL_SOURCE_PATH || './notes';
  const fileList = scanDirs(sourcePath).fileList;
  const pageTiles: string[] = removePrefixOfFileList(fileList, sourcePath);
  // const supppoertedFileTypes = ['.md', '.markdown', '.mdown', '.mkdn'];
  SYNC_CLOUD_TIME = fileList.length * 100 + 3000;
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i] as string;
    if (!file.includes('.md')) {
      continue;
    }
    const pageContent = fs.readFileSync(file, 'utf-8');
    const pageTitle = pageTiles[i];
    await createPage(_page, pageTitle, pageContent);
  }
  console.log('[info] batchCreatePagesByNotes success ' + SYNC_CLOUD_TIME);
};
