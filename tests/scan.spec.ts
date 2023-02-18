import { test } from './libs/playwright';
import { scanDirs, removePrefixOfFileList } from './libs/file-logic';

// npx playwright test tests/scan.spec.ts
test.describe('scan ', () => {
  test.skip('scan dirs', async ({ page }) => {
    const { fileList } = scanDirs('./notes');
    console.log(removePrefixOfFileList(fileList, './notes'));
  });

  test('scan dirs absolute path', async ({ page }) => {
    const sourcePath = '/Users/affiner/src/AFFiNE-docs';
    const fileList = scanDirs(sourcePath).fileList;
    const pageTiles: string[] = removePrefixOfFileList(fileList, sourcePath);
    console.log(pageTiles);
  });
});
