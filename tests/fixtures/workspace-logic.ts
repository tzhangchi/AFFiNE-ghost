import { expect, Page } from '@playwright/test';

interface CreateWorkspaceParams {
  name: string;
}
export async function createWorkspace(
  params: CreateWorkspaceParams,
  page: Page
) {
  // open workspace list modal
  const workspaceName = page.getByTestId('workspace-name');
  await workspaceName.click();

  // open create workspace modal
  await page.locator('.add-icon').click();

  // input workspace name
  await page.getByPlaceholder('Set a Workspace name').click();
  await page.getByPlaceholder('Set a Workspace name').fill(params.name);

  // click create button
  await page.getByRole('button', { name: 'Create' }).click();
  console.log(`[info] createWorkspace [${workspaceName}] success `);
  return { workspaceName };
}

export async function enableCloudAndPublic(_page: Page, taskTime: number) {
  await _page.getByTestId('sliderBar').click();
  await _page.getByRole('link', { name: 'Settings' }).click();
  await _page.getByText('Collaboration').click();
  await _page.getByRole('button', { name: 'Enable AFFiNE Cloud' }).click();
  await _page.getByRole('button', { name: 'Enable' }).click();

  await _page.waitForTimeout(taskTime);

  console.log('[info] enableCloud success');

  console.log(_page.url());

  const cloudWorkspaceId = _page
    .url()
    .split('/workspace/')[1]
    .replace('/setting', '');
  // if eable cloud success, the workspace id should be 21 length
  expect(cloudWorkspaceId.length).toEqual(21);

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
}

export function getEnvWorkspaceName() {
  return (
    process.env.AFFiNE_WORKSPACE_NAME ||
    (process.env.AFFiNE_LOCAL_SOURCE_PATH &&
      process.env.AFFiNE_LOCAL_SOURCE_PATH.split('/').reverse()[0]) ||
    'AFFiNE-ghost'
  );
}
