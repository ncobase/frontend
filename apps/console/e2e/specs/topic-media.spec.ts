import { expect, test } from '@playwright/test';

import { resourceFiles } from '../support/data';
import { setupConsolePage, dialogByTitle } from '../support/page';

test('uploads media, reuses resource-backed media, sorts topic media and retries failed sync', async ({
  page
}) => {
  const server = await setupConsolePage(page, { topicMediaSyncFailure: true });

  await page.goto('/content/topics/topic-editable/edit');
  await expect(page.getByRole('heading', { name: 'Editable Topic' })).toBeVisible();
  await page.getByRole('button', { name: /Manage Topic Media/ }).click();

  const manager = dialogByTitle(page, 'Manage Topic Media');
  await expect(manager).toBeVisible();

  const gallerySection = page.getByTestId('topic-media-section-gallery');
  await gallerySection.getByRole('button', { name: /Upload/ }).click();

  const uploadDialog = dialogByTitle(page, 'Upload Media');
  await uploadDialog.getByTestId('file-uploader-input').setInputFiles({
    name: 'gallery-image.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('image-bytes')
  });
  await expect(uploadDialog).toBeHidden();
  await expect(gallerySection).toContainText('Gallery CMS Image');

  await gallerySection.getByRole('button', { name: /Resources/ }).click();
  const resourceDialog = dialogByTitle(page, 'Select Existing Resources');
  await resourceDialog
    .getByTestId(`resource-media-picker-item-${resourceFiles.referenced.id}`)
    .click();
  await resourceDialog.getByRole('button', { name: /Use Selected/ }).click();
  await expect(resourceDialog).toBeHidden();

  await gallerySection.getByRole('button', { name: 'Move media up' }).last().click();
  await manager.getByRole('button', { name: 'Save' }).click();
  await expect(manager).toContainText('Topic media sync failed');

  server.topicMediaSyncFailure = false;
  await manager.getByRole('button', { name: 'Save' }).click();
  await expect(manager).toBeHidden();

  const syncRequests = server.requests.filter(
    item => item.path.startsWith('/cms/topic-media') && ['POST', 'PUT'].includes(item.method)
  );
  expect(syncRequests.length).toBeGreaterThan(1);
});
