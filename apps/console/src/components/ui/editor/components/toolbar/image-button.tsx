import React, { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ImageButtonProps } from '@/components/ui/editor/types';
import { Input, Label } from '@/components/ui/forms';
import { Icons } from '@/components/ui/icon';
import { useTranslation } from '@/components/ui/lib/i18n';
import { Tooltip } from '@/components/ui/tooltip';

export const ImageButton: React.FC<ImageButtonProps> = ({ editor, uploadFn }) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlInsert = () => {
    if (imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: altText
        })
        .run();
      resetAndClose();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadFn) return;

    try {
      setUploading(true);
      const url = await uploadFn(file);
      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          alt: altText || file.name.split('.')[0] // Use filename as alt text if none exists
        })
        .run();
      resetAndClose();
    } catch (error) {
      console.error('Error uploading image:', error);
      // Use translation for error message
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };

  const resetAndClose = () => {
    setImageUrl('');
    setAltText('');
    setDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Tooltip content={t('editor.toolbar.insertImage')}>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setDialogOpen(true)}
          aria-label={t('editor.toolbar.insertImage')}
        >
          <Icons className='text-gray-700 dark:text-gray-200' name='IconImageInPicture' />
        </Button>
      </Tooltip>

      <Dialog isOpen={dialogOpen} onChange={() => setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('editor.dialog.image.title')}</DialogTitle>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='imageUrl'>{t('editor.dialog.image.url')}</Label>
              <Input
                id='imageUrl'
                placeholder='https://example.com/image.jpg'
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='altText'>{t('editor.dialog.image.altText')}</Label>
              <Input
                id='altText'
                placeholder={t('editor.dialog.image.altText')}
                value={altText}
                onChange={e => setAltText(e.target.value)}
              />
            </div>

            {uploadFn && (
              <div className='space-y-2'>
                <Label htmlFor='fileUpload'>{t('editor.dialog.image.upload')}</Label>
                <Input
                  ref={fileInputRef}
                  id='fileUpload'
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {uploading && (
                  <p className='text-muted-foreground'>{t('editor.dialog.image.uploading')}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={resetAndClose}>
              {t('editor.dialog.image.cancel')}
            </Button>
            <Button onClick={handleUrlInsert} disabled={!imageUrl || uploading}>
              {t('editor.dialog.image.insert')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
