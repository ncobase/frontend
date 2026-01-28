import React, { useState, useEffect, useCallback, memo } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { LinkButtonProps } from '@/components/ui/editor/types';
import { Checkbox, Input, Label } from '@/components/ui/forms';
import { useTranslation } from '@/components/ui/lib/i18n';

export const LinkButton = memo(({ editor, isOpen, onClose }: LinkButtonProps) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [openInNewTab, setOpenInNewTab] = useState<boolean>(true);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen && editor.isActive('link')) {
      setUrl(editor.getAttributes('link')['href'] || '');
      const selection = editor.state.selection;
      setText(editor.state.doc.textBetween(selection.from, selection.to, ' ') || '');
    } else if (isOpen) {
      const selection = editor.state.selection;
      setText(editor.state.doc.textBetween(selection.from, selection.to, ' ') || '');
    }
  }, [isOpen, editor]);

  // Validate URL
  const validateUrl = useCallback(
    (input: string): boolean => {
      if (!input.trim()) {
        setErrorMessage('');
        return true; // Empty is valid (will remove the link)
      }

      try {
        // Try to create a URL object
        new URL(input.includes('://') ? input : `https://${input}`);
        setErrorMessage('');
        return true;
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (e) {
        setErrorMessage(t('editor.link.invalidUrl'));
        return false;
      }
    },
    [t]
  );

  // Handle URL change with validation
  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = e.target.value;
      setUrl(newUrl);
      setIsValidUrl(validateUrl(newUrl));
    },
    [validateUrl]
  );

  const handleSave = useCallback(() => {
    // Revalidate URL before saving
    if (!validateUrl(url)) {
      return;
    }

    if (url) {
      // Format the URL if needed
      let formattedUrl = url;
      if (formattedUrl.trim() !== '' && !formattedUrl.match(/^[a-z]+:\/\//i)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      // If text is selected, update the text
      if (text && editor.state.selection.from !== editor.state.selection.to) {
        editor
          .chain()
          .focus()
          .deleteSelection()
          .insertContent(text)
          .setTextSelection({
            from: editor.state.selection.from - text.length,
            to: editor.state.selection.from
          })
          .setLink({
            href: formattedUrl,
            target: openInNewTab ? '_blank' : null,
            rel: openInNewTab ? 'noopener noreferrer nofollow' : null
          })
          .run();
      } else {
        // Just set the link on the selection or current position
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({
            href: formattedUrl,
            target: openInNewTab ? '_blank' : null,
            rel: openInNewTab ? 'noopener noreferrer nofollow' : null
          })
          .run();
      }
    } else {
      // If URL is empty, remove the link
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }

    handleClose();
  }, [url, text, openInNewTab, editor, validateUrl]);

  const handleClose = useCallback(() => {
    setUrl('');
    setText('');
    setOpenInNewTab(true);
    setIsValidUrl(true);
    setErrorMessage('');
    onClose();
  }, [onClose]);

  return (
    <Dialog isOpen={isOpen} onChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editor.dialog.link.title')}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='url' className='flex justify-between'>
              <span>{t('editor.dialog.link.url')}</span>
              {!isValidUrl && <span className='text-destructive text-xs'>{errorMessage}</span>}
            </Label>
            <Input
              id='url'
              placeholder='https://example.com'
              value={url}
              onChange={handleUrlChange}
              className={!isValidUrl ? 'border-destructive' : ''}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='text'>{t('editor.dialog.link.text')}</Label>
            <Input
              id='text'
              placeholder={t('editor.link.textPlaceholder')}
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='newTab'
              checked={openInNewTab}
              onCheckedChange={checked => setOpenInNewTab(checked as boolean)}
            />
            <Label htmlFor='newTab' className='cursor-pointer'>
              {t('editor.dialog.link.openInNewTab')}
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            {t('editor.dialog.link.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!isValidUrl}>
            {t('editor.dialog.link.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
