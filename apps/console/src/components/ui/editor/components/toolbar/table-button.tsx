import React from 'react';

import { Button } from '@/components/ui/button';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@/components/ui/dropdown';
import { TableButtonProps } from '@/components/ui/editor/types';
import { Icons } from '@/components/ui/icon';
import { useTranslation } from '@/components/ui/lib/i18n';
import { Tooltip } from '@/components/ui/tooltip';

export const TableButton: React.FC<TableButtonProps> = ({ editor }) => {
  const { t } = useTranslation();
  const isTableActive = editor.isActive('table');

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <Dropdown>
      <Tooltip content={t('editor.toolbar.table')}>
        <DropdownTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className={isTableActive ? 'is-active' : ''}
            aria-label={t('editor.toolbar.table')}
          >
            <Icons className='text-gray-700 dark:text-gray-200' name='IconTable' />
          </Button>
        </DropdownTrigger>
      </Tooltip>
      <DropdownContent align='start'>
        {!isTableActive ? (
          <DropdownItem onClick={insertTable}>{t('editor.dialog.table.insertTable')}</DropdownItem>
        ) : (
          <>
            <DropdownItem
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              disabled={!editor.can().addColumnBefore()}
            >
              {t('editor.dialog.table.addColumnBefore')}
            </DropdownItem>
            <DropdownItem
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              disabled={!editor.can().addColumnAfter()}
            >
              {t('editor.dialog.table.addColumnAfter')}
            </DropdownItem>
            <DropdownItem
              onClick={() => editor.chain().focus().deleteColumn().run()}
              disabled={!editor.can().deleteColumn()}
            >
              {t('editor.dialog.table.deleteColumn')}
            </DropdownItem>
            <DropdownItem
              onClick={() => editor.chain().focus().addRowBefore().run()}
              disabled={!editor.can().addRowBefore()}
            >
              {t('editor.dialog.table.addRowBefore')}
            </DropdownItem>
            <DropdownItem
              onClick={() => editor.chain().focus().addRowAfter().run()}
              disabled={!editor.can().addRowAfter()}
            >
              {t('editor.dialog.table.addRowAfter')}
            </DropdownItem>
            <DropdownItem
              onClick={() => editor.chain().focus().deleteRow().run()}
              disabled={!editor.can().deleteRow()}
            >
              {t('editor.dialog.table.deleteRow')}
            </DropdownItem>
            <DropdownItem
              onClick={() => editor.chain().focus().deleteTable().run()}
              disabled={!editor.can().deleteTable()}
            >
              {t('editor.dialog.table.deleteTable')}
            </DropdownItem>
            <DropdownItem
              onClick={() => editor.chain().focus().mergeCells().run()}
              disabled={!editor.can().mergeCells()}
            >
              {t('editor.dialog.table.mergeCells')}
            </DropdownItem>
            <DropdownItem
              onClick={() => editor.chain().focus().splitCell().run()}
              disabled={!editor.can().splitCell()}
            >
              {t('editor.dialog.table.splitCell')}
            </DropdownItem>
            <DropdownItem
              onClick={() => editor.chain().focus().toggleHeaderCell().run()}
              disabled={!editor.can().toggleHeaderCell()}
            >
              {t('editor.dialog.table.toggleHeaderCell')}
            </DropdownItem>
          </>
        )}
      </DropdownContent>
    </Dropdown>
  );
};
