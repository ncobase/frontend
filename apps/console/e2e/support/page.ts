import { expect, type Locator, type Page } from '@playwright/test';

import { installConsoleApiMocks, type ConsoleMockServer } from './api';
import { seedAuthenticatedSession } from './auth';

export const setupConsolePage = async (
  page: Page,
  options?: Partial<ConsoleMockServer> & { spaceId?: string }
) => {
  const server = await installConsoleApiMocks(page, options);
  await seedAuthenticatedSession(page, options?.spaceId || 'space-alpha');
  return server;
};

export const expectRequestHeader = (
  server: ConsoleMockServer,
  path: string,
  header: string,
  expected: string
) => {
  const request = server.requests.find(item => item.path === path);
  expect(request, `request ${path}`).toBeTruthy();
  expect(request?.headers[header.toLowerCase()]).toBe(expected);
};

export const expectLastRequestHeader = (
  server: ConsoleMockServer,
  path: string,
  header: string,
  expected: string
) => {
  const requests = server.requests.filter(item => item.path === path);
  expect(requests.length, `request count ${path}`).toBeGreaterThan(0);
  expect(requests.at(-1)?.headers[header.toLowerCase()]).toBe(expected);
};

export const dialogByTitle = (page: Page, title: string) =>
  page.locator('[role="dialog"], [role="alertdialog"]').filter({ hasText: title }).last();

export const clickRowAction = async (page: Page, row: Locator, action: string) => {
  await row.getByRole('button').last().click();
  await page.getByRole('menuitem', { name: action }).click();
};

export const expectToast = async (page: Page, text: string | RegExp) => {
  await expect(page.locator('body')).toContainText(text);
};
