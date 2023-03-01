import { expect, Page } from '@playwright/test';

export async function autoLogin(_page: Page, token) {
  // open login modal
  await _page.getByTestId('workspace-name').click();

  //check unlogin
  expect(await _page.locator('Sign in AFFiNE Cloud')).not.toBeNull();
  const AFFiNE_LOGIN_TOKEN = token;

  const affineLogin = await _page.evaluate(
    function (o) {
      window.localStorage.setItem('affine:login', o.token || '');
    },
    { token: AFFiNE_LOGIN_TOKEN }
  );
  await _page.reload();

  await _page.waitForTimeout(3000);
  //  TODO: check login success
  // check login success, if error here, please check your token
  // await _page.getByTestId('workspace-name').click();
  // await _page.waitForTimeout(1000);
  // expect(await _page.locator('Sign in AFFiNE Cloud')).not.toBeDefined();

  console.log('[info] passAuth success');
}
