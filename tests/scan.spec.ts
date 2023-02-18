import { test } from './libs/playwright';
import { scanDirs, removeRootName } from './libs/file-logic';
test.describe('scan ', () => {
  test('scan dirs', async ({ page }) => {
    const { filesList } = scanDirs('./notes');
    console.log(removeRootName(filesList, './notes'));
  });
});
