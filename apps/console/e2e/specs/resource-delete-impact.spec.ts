import { expect, test } from '@playwright/test';

import { setupConsolePage, clickRowAction, dialogByTitle } from '../support/page';

test('blocks resource deletion when CMS media and topic references exist', async ({ page }) => {
  const server = await setupConsolePage(page);

  await page.goto('/res');
  const row = page.getByRole('row').filter({ hasText: 'Referenced Image.jpg' });
  await expect(row).toBeVisible();
  await clickRowAction(page, row, 'Delete');

  const dialog = dialogByTitle(page, 'Delete File');
  await expect(dialog).toContainText('Referenced CMS Image');
  await expect(dialog).toContainText('Referenced Topic');
  await expect(dialog.getByRole('button', { name: 'Delete' })).toBeDisabled();
  await expect
    .poll(() =>
      server.requests.some(item => item.method === 'POST' && item.path === '/res/delete-impact')
    )
    .toBe(true);

  await dialog.getByRole('button', { name: 'Referenced CMS Image' }).click();
  await expect(page).toHaveURL(/\/content\/media\/media-referenced$/);
});

test('allows deletion when the reference impact check is clear', async ({ page }) => {
  const server = await setupConsolePage(page);

  await page.goto('/res');
  const row = page.getByRole('row').filter({ hasText: 'Clear Document.pdf' });
  await expect(row).toBeVisible();
  await clickRowAction(page, row, 'Delete');

  const dialog = dialogByTitle(page, 'Delete File');
  await expect(dialog).toContainText('No CMS media or topic references were found');
  await expect(dialog.getByRole('button', { name: 'Delete' })).toBeEnabled();
  await dialog.getByRole('button', { name: 'Delete' }).click();

  await expect
    .poll(() =>
      server.requests.some(item => item.method === 'DELETE' && item.path === '/res/resource-clear')
    )
    .toBe(true);
  await expect(page.locator('body')).toContainText('File deleted');
});
