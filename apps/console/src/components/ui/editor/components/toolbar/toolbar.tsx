import React from 'react';

import { ColorButton } from './color-button';
import { ImageButton } from './image-button';
import { LinkButton } from './link-button';
import { TableButton } from './table-button';

import { Button } from '@/components/ui/button';
import { DropdownTrigger, DropdownContent, DropdownItem, Dropdown } from '@/components/ui/dropdown';
import { ToolbarProps } from '@/components/ui/editor/types';
import { Icons } from '@/components/ui/icon';
import { useTranslation } from '@/components/ui/lib/i18n';
import { cn } from '@/components/ui/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';

export const Toolbar: React.FC<ToolbarProps> = ({ editor, className = '', onSave }) => {
  const { t } = useTranslation();
  const [linkDialogOpen, setLinkButtonOpen] = React.useState(false);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('nco-editor-toolbar', className)}>
      {/* Text formatting */}
      <div className='nco-editor-group'>
        <Tooltip content={t('editor.toolbar.bold') + ' (Ctrl+B)'}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'is-active' : ''}
            aria-label={t('editor.toolbar.bold')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconBold' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.italic') + ' (Ctrl+I)'}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'is-active' : ''}
            aria-label={t('editor.toolbar.italic')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconItalic' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.strike') + ' (Ctrl+Shift+X)'}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'is-active' : ''}
            aria-label={t('editor.toolbar.strike')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconStrikethrough' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.code')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'is-active' : ''}
            aria-label={t('editor.toolbar.code')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconCode' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.highlight')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'is-active' : ''}
            aria-label={t('editor.toolbar.highlight')}
          >
            <Icons className='bg-yellow-200 dark:bg-yellow-800 rounded' name='IconLetterHSmall' />
          </Button>
        </Tooltip>
      </div>

      {/* Text alignment */}
      <div className='nco-editor-group'>
        <Tooltip content={t('editor.toolbar.alignLeft')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
            aria-label={t('editor.toolbar.alignLeft')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconAlignLeft' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.alignCenter')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
            aria-label={t('editor.toolbar.alignCenter')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconAlignCenter' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.alignRight')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
            aria-label={t('editor.toolbar.alignRight')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconAlignRight' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.alignJustify')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
            aria-label={t('editor.toolbar.alignJustify')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconAlignJustified' />
          </Button>
        </Tooltip>
      </div>

      {/* Headings */}
      <div className='nco-editor-group'>
        <Dropdown>
          <Tooltip content={t('editor.toolbar.heading')}>
            <DropdownTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className={editor.isActive('heading') ? 'is-active' : ''}
                aria-label={t('editor.toolbar.heading')}
              >
                <Icons className='text-gray-700 dark:text-gray-200' name='IconHeading' />
              </Button>
            </DropdownTrigger>
          </Tooltip>
          <DropdownContent align='start'>
            <DropdownItem onClick={() => editor.chain().focus().setParagraph().run()}>
              <span className={editor.isActive('paragraph') ? 'font-bold' : ''}>
                {t('editor.toolbar.paragraph')}
              </span>
            </DropdownItem>
            <DropdownItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <span className={editor.isActive('heading', { level: 1 }) ? 'font-bold' : ''}>
                {t('editor.toolbar.heading1')}
              </span>
            </DropdownItem>
            <DropdownItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <span className={editor.isActive('heading', { level: 2 }) ? 'font-bold' : ''}>
                {t('editor.toolbar.heading2')}
              </span>
            </DropdownItem>
            <DropdownItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <span className={editor.isActive('heading', { level: 3 }) ? 'font-bold' : ''}>
                {t('editor.toolbar.heading3')}
              </span>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>

        <ColorButton editor={editor} />
      </div>

      {/* Lists */}
      <div className='nco-editor-group'>
        <Tooltip content={t('editor.toolbar.bulletList')}>
          <Button
            variant='unstyle'
            size='icon'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'is-active' : ''}
            aria-label={t('editor.toolbar.bulletList')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconList' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.orderedList')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'is-active' : ''}
            aria-label={t('editor.toolbar.orderedList')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconListNumbers' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.taskList')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive('taskList') ? 'is-active' : ''}
            aria-label={t('editor.toolbar.taskList')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconListCheck' />
          </Button>
        </Tooltip>
      </div>

      {/* Block elements */}
      <div className='nco-editor-group'>
        <Tooltip content={t('editor.toolbar.blockquote')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'is-active' : ''}
            aria-label={t('editor.toolbar.blockquote')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconBlockquote' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.codeBlock')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'is-active' : ''}
            aria-label={t('editor.toolbar.codeBlock')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconCodeDots' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.horizontalRule')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            aria-label={t('editor.toolbar.horizontalRule')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconSeparator' />
          </Button>
        </Tooltip>
      </div>

      {/* Links and media */}
      <div className='nco-editor-group'>
        <Tooltip content={t('editor.toolbar.link')}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setLinkButtonOpen(true)}
            className={editor.isActive('link') ? 'is-active' : ''}
            aria-label={t('editor.toolbar.link')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconLink' />
          </Button>
        </Tooltip>
        <ImageButton editor={editor} />
        <TableButton editor={editor} />
      </div>

      {/* History and save */}
      <div className='nco-editor-group'>
        <Tooltip content={t('editor.toolbar.undo') + ' (Ctrl+Z)'}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            aria-label={t('editor.toolbar.undo')}
          >
            <Icons className='text-gray-900 dark:text-gray-200' name='IconArrowBackUp' />
          </Button>
        </Tooltip>

        <Tooltip content={t('editor.toolbar.redo') + ' (Ctrl+Shift+Z)'}>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            aria-label={t('editor.toolbar.redo')}
          >
            <Icons className='text-gray-900 dark:text-gray-200' name='IconArrowForwardUp' />
          </Button>
        </Tooltip>

        {onSave && (
          <Tooltip content={t('editor.toolbar.save') + ' (Ctrl+S)'}>
            <Button
              variant='ghost'
              size='icon'
              onClick={onSave}
              aria-label={t('editor.toolbar.save')}
            >
              <Icons className='text-gray-700 dark:text-gray-200' name='IconDeviceFloppy' />
            </Button>
          </Tooltip>
        )}
      </div>

      {/* Link dialog */}
      <LinkButton
        editor={editor}
        isOpen={linkDialogOpen}
        onClose={() => setLinkButtonOpen(false)}
      />
    </div>
  );
};
