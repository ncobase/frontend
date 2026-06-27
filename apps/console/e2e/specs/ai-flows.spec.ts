import { expect, test } from '@playwright/test';

import { aiRun } from '../support/data';
import { setupConsolePage } from '../support/page';

test('runs playground completion and opens the persisted run detail', async ({ page }) => {
  const server = await setupConsolePage(page);

  await page.goto('/ai/playground');
  await expect(page.getByText('AI Playground').first()).toBeVisible();
  await page.getByLabel('Prompt').fill('Draft a production release summary.');
  await page.getByRole('button', { name: /^Run$/ }).click();

  await expect(page.getByText('Production-ready AI completion.')).toBeVisible();
  await expect(page.getByRole('link', { name: aiRun.id })).toBeVisible();
  await page.getByRole('link', { name: aiRun.id }).click();

  await expect(page).toHaveURL(/\/ai\/runs\/run-playground-1$/);
  await expect(page.getByText('AI Run Details').first()).toBeVisible();
  await expect(page.getByText('console.ai.playground')).toBeVisible();
  expect(server.requests.some(item => item.method === 'POST' && item.path === '/ai/complete')).toBe(
    true
  );
});

test('runs a governed AI action through the action endpoint', async ({ page }) => {
  const server = await setupConsolePage(page);

  await page.goto('/ai/actions');
  await expect(page.getByRole('heading', { name: 'Summarize Content' })).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Content' })
    .fill('Ncobase adds production browser coverage.');
  await page
    .getByLabel('Actions')
    .getByRole('button', { name: /^Run action$/ })
    .click();

  await expect(page.getByText('Action summary output.')).toBeVisible();
  expect(
    server.requests.some(
      item => item.method === 'POST' && item.path === '/ai/actions/content.summary'
    )
  ).toBe(true);
});
