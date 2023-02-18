import { test } from './libs/playwright';
import { scanDirs, removePrefixOfFileList } from './libs/file-logic';
test.describe('scan ', () => {
  test('scan dirs', async ({ page }) => {
    const { fileList } = scanDirs('./notes');
    console.log(removePrefixOfFileList(fileList, './notes'));
  });
});
