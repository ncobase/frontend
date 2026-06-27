import { expect, test } from '@playwright/test';

import { SPACE_KEY } from '../support/auth';
import { setupConsolePage, dialogByTitle, expectLastRequestHeader } from '../support/page';

test('refreshes session, account and navigation when the active space changes', async ({
  page
}) => {
  const server = await setupConsolePage(page);

  await page.goto('/dash');
  await expect(page.getByText('Alpha Dashboard').first()).toBeVisible();

  await page.getByRole('button', { name: /Alpha Workspace/ }).click();
  await page.getByRole('menuitem', { name: /Switch Space/ }).click();

  const switchDialog = dialogByTitle(page, 'Switch Space');
  await expect(switchDialog).toBeVisible();
  await switchDialog.getByRole('button', { name: /Beta Workspace/ }).click();

  await expect(page.getByText('Beta Dashboard').first()).toBeVisible();
  await expect
    .poll(() => server.requests.filter(item => item.path === '/account').length)
    .toBeGreaterThan(1);
  expectLastRequestHeader(server, '/refresh-token', 'x-md-sid', 'space-beta');
  expectLastRequestHeader(server, '/account', 'x-md-sid', 'space-beta');
  expectLastRequestHeader(server, '/sys/menus/navigation', 'x-md-sid', 'space-beta');

  await expect
    .poll(() => page.evaluate(key => window.localStorage.getItem(key), SPACE_KEY))
    .toBe('space-beta');
});
