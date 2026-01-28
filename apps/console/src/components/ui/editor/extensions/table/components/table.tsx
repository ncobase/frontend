import React, { useCallback, memo } from 'react';

import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTitle
} from '@/components/ui/dialog';
import { Icons } from '@/components/ui/icon';
import { useTranslation } from '@/components/ui/lib/i18n';
import { Tooltip } from '@/components/ui/tooltip';

interface TableComponentProps {
  node: any;
  editor: any;
  getPos: () => number;
  updateAttributes: (_attrs: Record<string, any>) => void;
}

export const TableComponent = memo(
  ({ editor, node: _node, getPos: _getPos }: TableComponentProps) => {
    const { t } = useTranslation();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [actionType, setActionType] = React.useState<string | null>(null);
    const [tableSizeConfig, setTableSizeConfig] = React.useState({ rows: 3, cols: 3 });

    // Handle button actions
    const handleAction = useCallback(
      (action: string) => {
        switch (action) {
          case 'add-column-before':
            editor.chain().focus().addColumnBefore().run();
            break;
          case 'add-column-after':
            editor.chain().focus().addColumnAfter().run();
            break;
          case 'delete-column':
            editor.chain().focus().deleteColumn().run();
            break;
          case 'add-row-before':
            editor.chain().focus().addRowBefore().run();
            break;
          case 'add-row-after':
            editor.chain().focus().addRowAfter().run();
            break;
          case 'delete-row':
            editor.chain().focus().deleteRow().run();
            break;
          case 'delete-table':
            // Open confirmation dialog
            setActionType('delete-table');
            setIsDialogOpen(true);
            break;
          case 'merge-cells':
            editor.chain().focus().mergeCells().run();
            break;
          case 'split-cell':
            editor.chain().focus().splitCell().run();
            break;
          case 'toggle-header':
            editor.chain().focus().toggleHeaderCell().run();
            break;
          case 'create-table':
            setActionType('create-table');
            setIsDialogOpen(true);
            break;
          default:
            break;
        }
      },
      [editor]
    );

    // Handle confirmation dialog actions
    const handleDialogConfirm = useCallback(() => {
      if (actionType === 'delete-table') {
        editor.chain().focus().deleteTable().run();
      } else if (actionType === 'create-table') {
        editor
          .chain()
          .focus()
          .insertTable({
            rows: tableSizeConfig.rows,
            cols: tableSizeConfig.cols,
            withHeaderRow: true
          })
          .run();
      }
      setIsDialogOpen(false);
      setActionType(null);
    }, [actionType, editor, tableSizeConfig]);

    // For table size configuration in dialog
    const handleTableSizeChange = useCallback((type: 'rows' | 'cols', value: string) => {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0 && numValue <= 10) {
        setTableSizeConfig(prev => ({ ...prev, [type]: numValue }));
      }
    }, []);

    return (
      <NodeViewWrapper className='custom-table-component'>
        <div className='table-toolbar' role='toolbar' aria-label={t('editor.table.toolbar')}>
          <div className='table-button-group'>
            <Tooltip content={t('editor.dialog.table.addColumnBefore')}>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('add-column-before')}
                aria-label={t('editor.dialog.table.addColumnBefore')}
                disabled={!editor.can().addColumnBefore()}
              >
                <Icons name='IconColumnInsertLeft' className='w-4 h-4' />
              </Button>
            </Tooltip>

            <Tooltip content={t('editor.dialog.table.addColumnAfter')}>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('add-column-after')}
                aria-label={t('editor.dialog.table.addColumnAfter')}
                disabled={!editor.can().addColumnAfter()}
              >
                <Icons name='IconColumnInsertRight' className='w-4 h-4' />
              </Button>
            </Tooltip>

            <Tooltip content={t('editor.dialog.table.deleteColumn')}>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('delete-column')}
                aria-label={t('editor.dialog.table.deleteColumn')}
                disabled={!editor.can().deleteColumn()}
              >
                <Icons name='IconColumnRemove' className='w-4 h-4' />
              </Button>
            </Tooltip>
          </div>

          <div className='table-button-group'>
            <Tooltip content={t('editor.dialog.table.addRowBefore')}>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('add-row-before')}
                aria-label={t('editor.dialog.table.addRowBefore')}
                disabled={!editor.can().addRowBefore()}
              >
                <Icons name='IconRowInsertTop' className='w-4 h-4' />
              </Button>
            </Tooltip>

            <Tooltip content={t('editor.dialog.table.addRowAfter')}>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('add-row-after')}
                aria-label={t('editor.dialog.table.addRowAfter')}
                disabled={!editor.can().addRowAfter()}
              >
                <Icons name='IconRowInsertBottom' className='w-4 h-4' />
              </Button>
            </Tooltip>

            <Tooltip content={t('editor.dialog.table.deleteRow')}>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('delete-row')}
                aria-label={t('editor.dialog.table.deleteRow')}
                disabled={!editor.can().deleteRow()}
              >
                <Icons name='IconRowRemove' className='w-4 h-4' />
              </Button>
            </Tooltip>
          </div>

          <div className='table-button-group'>
            <Tooltip content={t('editor.dialog.table.mergeCells')}>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('merge-cells')}
                aria-label={t('editor.dialog.table.mergeCells')}
                disabled={!editor.can().mergeCells()}
              >
                <Icons name='IconViewportNarrow' className='w-4 h-4' />
              </Button>
            </Tooltip>

            <Tooltip content={t('editor.dialog.table.splitCell')}>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('split-cell')}
                aria-label={t('editor.dialog.table.splitCell')}
                disabled={!editor.can().splitCell()}
              >
                <Icons name='IconArrowBarBoth' className='w-4 h-4' />
              </Button>
            </Tooltip>

            <Tooltip content={t('editor.dialog.table.toggleHeaderCell')}>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('toggle-header')}
                aria-label={t('editor.dialog.table.toggleHeaderCell')}
                disabled={!editor.can().toggleHeaderCell()}
              >
                <Icons name='IconLayoutNavbar' className='w-4 h-4' />
              </Button>
            </Tooltip>
          </div>

          <div className='table-button-group'>
            <Tooltip content={t('editor.dialog.table.deleteTable')}>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleAction('delete-table')}
                aria-label={t('editor.dialog.table.deleteTable')}
                disabled={!editor.can().deleteTable()}
              >
                <Icons name='IconTableOff' className='w-4 h-4' />
              </Button>
            </Tooltip>
          </div>
        </div>

        <NodeViewContent className='table-content' as='table' />

        {/* Confirmation Dialog */}
        <Dialog isOpen={isDialogOpen} onChange={() => setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'delete-table'
                  ? t('editor.dialog.table.confirmDelete')
                  : t('editor.dialog.table.createTable')}
              </DialogTitle>
            </DialogHeader>

            {actionType === 'create-table' && (
              <div className='grid grid-cols-2 gap-4 py-4'>
                <div className='space-y-2'>
                  <label htmlFor='rows' className='font-medium'>
                    {t('editor.dialog.table.rows')}
                  </label>
                  <input
                    id='rows'
                    type='number'
                    min='1'
                    max='10'
                    value={tableSizeConfig.rows}
                    onChange={e => handleTableSizeChange('rows', e.target.value)}
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='cols' className='font-medium'>
                    {t('editor.dialog.table.columns')}
                  </label>
                  <input
                    id='cols'
                    type='number'
                    min='1'
                    max='10'
                    value={tableSizeConfig.cols}
                    onChange={e => handleTableSizeChange('cols', e.target.value)}
                    className='w-full p-2 border rounded'
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
                {t('editor.dialog.image.cancel')}
              </Button>
              <Button onClick={handleDialogConfirm}>
                {actionType === 'delete-table'
                  ? t('editor.dialog.table.delete')
                  : t('editor.dialog.table.create')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </NodeViewWrapper>
    );
  }
);
