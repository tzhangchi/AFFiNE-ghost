// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { autoLogin } from './fixtures/auth-logic';
import { batchCreatePagesByNotes, loadPage } from './fixtures/page-logic';
import { test } from './fixtures/playwright';
import {
  createWorkspace,
  enableCloudAndPublic,
  getEnvWorkspaceName,
} from './fixtures/workspace-logic';

loadPage();

test.describe('create cloud workspace by different ways of importing ', () => {
  test('import by markdowns', async ({ page }) => {
    console.log(page.url());

    await autoLogin(page, process.env.AFFiNE_LOGIN_TOKEN);

    const newWorkspaceName = getEnvWorkspaceName();
    await createWorkspace(
      {
        name: newWorkspaceName,
      },
      page
    );

    await page.waitForTimeout(2000);
    console.log(page.url());

    const { predictTaskTime } = await batchCreatePagesByNotes(page);
    await enableCloudAndPublic(page, predictTaskTime);
  });
});
