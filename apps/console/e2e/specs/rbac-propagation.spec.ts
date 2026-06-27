import { expect, test } from '@playwright/test';

import { roles } from '../support/data';
import {
  setupConsolePage,
  clickRowAction,
  dialogByTitle,
  expectLastRequestHeader
} from '../support/page';

test('refreshes navigation and affected identity data after menu changes', async ({ page }) => {
  const server = await setupConsolePage(page);

  await page.goto('/system/menus');
  await expect(page.getByText('Menu Management')).toBeVisible();
  const row = page.getByRole('row').filter({ hasText: 'Content' });
  await clickRowAction(page, row, 'Hide');

  await expect
    .poll(() =>
      server.requests.some(
        item => item.method === 'PUT' && item.path === '/sys/menus/menu-content/hide'
      )
    )
    .toBe(true);
  await expect
    .poll(() => server.requests.filter(item => item.path === '/sys/menus/navigation').length)
    .toBeGreaterThan(1);
  expectLastRequestHeader(server, '/sys/menus/navigation', 'x-md-sid', 'space-alpha');
});

test('propagates space role changes to space users and identity queries', async ({ page }) => {
  const server = await setupConsolePage(page);

  await page.goto('/spaces/space-alpha/users');
  const row = page.getByRole('row').filter({ hasText: 'editor@example.com' });
  await expect(row).toBeVisible();
  await clickRowAction(page, row, 'Roles');

  const roleDialog = dialogByTitle(page, 'Manage Roles');
  await roleDialog.getByRole('button', { name: /Add Role/ }).click();
  const addRoleDialog = dialogByTitle(page, 'Add Role');
  await addRoleDialog.getByRole('combobox').click();
  await page.getByRole('option', { name: roles.auditor.name }).click();
  await addRoleDialog.getByRole('button', { name: 'Add' }).click();

  await expect
    .poll(() =>
      server.requests.some(
        item => item.method === 'POST' && item.path === '/sys/spaces/space-alpha/users/roles'
      )
    )
    .toBe(true);
  await expect
    .poll(() => server.requests.filter(item => item.path === '/account').length)
    .toBeGreaterThan(1);
  await expect
    .poll(() => server.requests.filter(item => item.path === '/sys/menus/navigation').length)
    .toBeGreaterThan(1);
});
