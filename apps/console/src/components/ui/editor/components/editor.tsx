import React, { useEffect, useState } from 'react';

import { EditorContent } from '@tiptap/react';

import { BubbleMenu } from './bubble-menu';
import { FloatingMenu } from './floating-menu';
import { StatusBar } from './status-bar';
import { Toolbar } from './toolbar';
import { LinkButton } from './toolbar/link-button';

import { Button } from '@/components/ui/button';
import { useEditor } from '@/components/ui/editor/hooks/use-editor';
import { EditorProps } from '@/components/ui/editor/types';
import { Icons } from '@/components/ui/icon';
import { I18nProvider, useTranslation } from '@/components/ui/lib/i18n';
import { cn } from '@/components/ui/lib/utils';

const EditorContentC = EditorContent as any;

export const Editor: React.FC<EditorProps> = ({
  locale = 'en',
  direction = 'ltr',
  content = '<p></p>',
  editable = true,
  autofocus = false,
  placeholder,
  extensions = [],
  className = '',
  contentClassName = '',
  onUpdate,
  onChange,
  onSave,
  children,
  showBubbleMenu = false,
  showFloatingMenu = false,
  darkMode = false,
  readOnly = false,
  ...rest
}) => {
  const { t } = useTranslation();
  const [bubbleLinkDialogOpen, setBubbleLinkDialogOpen] = useState(false);

  // Use translated placeholder or default to translated version
  const translatedPlaceholder = placeholder || t('editor.placeholder');

  const editor = useEditor({
    content,
    editable: !readOnly && editable,
    autofocus,
    placeholder: translatedPlaceholder,
    extensions,
    onUpdate,
    onChange,
    ...rest
  });

  useEffect(() => {
    if (editor) {
      editor.extensionManager.extensions.forEach(extension => {
        if (extension.name === 'placeholder') {
          extension.options.placeholder = translatedPlaceholder;
          editor.view.dispatch(editor.state.tr);
        }
      });
    }
  }, [editor, locale, translatedPlaceholder]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  useEffect(() => {
    const rootElement = document.documentElement;

    if (darkMode) {
      rootElement.classList.add('dark');
    } else {
      rootElement.classList.remove('dark');
    }

    return () => {
      if (darkMode) {
        rootElement.classList.remove('dark');
      }
    };
  }, [darkMode]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <I18nProvider initialLocale={locale} direction={direction}>
      <div className={cn('nco-editor', className)}>
        {!readOnly && <Toolbar editor={editor} onSave={onSave} />}
        <EditorContentC editor={editor} className={cn('nco-editor-content', contentClassName)} />
        {showBubbleMenu && !readOnly && (
          <BubbleMenu editor={editor}>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'is-active' : ''}
              aria-label={t('editor.toolbar.bold')}
            >
              <Icons className='text-gray-700 dark:text-gray-200' name='IconBold' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'is-active' : ''}
              aria-label={t('editor.toolbar.italic')}
            >
              <Icons className='text-gray-700 dark:text-gray-200' name='IconItalic' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive('strike') ? 'is-active' : ''}
              aria-label={t('editor.toolbar.strike')}
            >
              <Icons className='text-gray-700 dark:text-gray-200' name='IconStrikethrough' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={editor.isActive('highlight') ? 'is-active' : ''}
              aria-label={t('editor.toolbar.highlight')}
            >
              <Icons className='bg-yellow-200 dark:bg-yellow-800 rounded' name='IconLetterHSmall' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setBubbleLinkDialogOpen(true)}
              className={editor.isActive('link') ? 'is-active' : ''}
              aria-label={t('editor.toolbar.link')}
            >
              <Icons className='text-gray-700 dark:text-gray-200' name='IconLink' />
            </Button>
          </BubbleMenu>
        )}
        {showFloatingMenu && !readOnly && (
          <FloatingMenu editor={editor}>
            <Button
              variant='ghost'
              onClick={() => editor.chain().focus().setParagraph().run()}
              aria-label={t('editor.toolbar.paragraph')}
            >
              {t('editor.toolbar.paragraph')}
            </Button>
            <Button
              variant='ghost'
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              aria-label={t('editor.toolbar.heading1')}
            >
              {t('editor.toolbar.heading1')}
            </Button>
            <Button
              variant='ghost'
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              aria-label={t('editor.toolbar.heading2')}
            >
              {t('editor.toolbar.heading2')}
            </Button>
            <Button
              variant='ghost'
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              aria-label={t('editor.toolbar.bulletList')}
            >
              • {t('editor.toolbar.bulletList')}
            </Button>
            <Button
              variant='ghost'
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              aria-label={t('editor.toolbar.orderedList')}
            >
              1. {t('editor.toolbar.orderedList')}
            </Button>
            <Button
              variant='ghost'
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              aria-label={t('editor.toolbar.codeBlock')}
            >
              {t('editor.toolbar.codeBlock')}
            </Button>
          </FloatingMenu>
        )}
        <StatusBar editor={editor} />
        {children}
        <LinkButton
          editor={editor}
          isOpen={bubbleLinkDialogOpen}
          onClose={() => setBubbleLinkDialogOpen(false)}
        />
      </div>
    </I18nProvider>
  );
};
