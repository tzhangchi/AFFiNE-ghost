import type { Page } from '@playwright/test';
import { test } from '@playwright/test';
import fs from 'fs';
import { removePrefixOfFileList, scanDirs } from './file-logic';

interface IType {
  page: Page;
}
export function loadPage() {
  test.beforeEach(async ({ page }: IType) => {
    // console.log(process.env.AFFiNE_APP_URL);
    await page.goto(process.env.AFFiNE_APP_URL);
    // waiting for page loading end
    await page.waitForSelector('#__next');
  });
}

export async function newPage(page: Page) {
  return page.getByText('New Page').click();
}

export async function createPage(_page: Page, title: string, content: string) {
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
}

export async function clickPageMoreActions(page: Page) {
  return page
    .getByTestId('editor-header-items')
    .getByRole('button')
    .nth(1)
    .click();
}

export async function batchCreatePagesByNotes(_page: Page) {
  const sourcePath = process.env.AFFiNE_LOCAL_SOURCE_PATH || './notes';
  const fileList = scanDirs(sourcePath).fileList;
  const pageTiles: string[] = removePrefixOfFileList(fileList, sourcePath);
  // const supppoertedFileTypes = ['.md', '.markdown', '.mdown', '.mkdn'];

  let predictTaskTime = 2500;
  predictTaskTime = fileList.length * 100 + 3000;
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i] as string;
    if (!file.includes('.md')) {
      continue;
    }
    const pageContent = fs.readFileSync(file, 'utf-8');
    const pageTitle = pageTiles[i];
    await createPage(_page, pageTitle, pageContent);
  }

  console.log('[info] batchCreatePagesByNotes success ' + predictTaskTime);
  return {
    predictTaskTime,
  };
}
