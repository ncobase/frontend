import React from 'react';
import { useState } from 'react';

import { Button, Icons, Modal } from '@ncobase/react';

interface BulkActionsProps {
  selectedItems: any[];
  onClearSelection: () => void;
  onBulkDelete?: (_ids: string[]) => void;
  onBulkStatusUpdate?: (_ids: string[], _status: number) => void;
  onBulkExport?: (_ids: string[]) => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedItems,
  onClearSelection,
  onBulkDelete,
  onBulkStatusUpdate,
  onBulkExport
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  if (selectedItems.length === 0) return null;

  const handleBulkDelete = () => {
    const ids = selectedItems.map(item => item.id).filter(Boolean);
    onBulkDelete?.(ids);
    setShowDeleteConfirm(false);
    onClearSelection();
  };

  const handleStatusUpdate = (status: number) => {
    const ids = selectedItems.map(item => item.id).filter(Boolean);
    onBulkStatusUpdate?.(ids, status);
    setShowStatusModal(false);
    onClearSelection();
  };

  const handleExport = () => {
    const ids = selectedItems.map(item => item.id).filter(Boolean);
    onBulkExport?.(ids);
  };

  return (
    <>
      <div className='fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg border border-gray-200 px-6 py-4 z-50'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-2'>
            <span className='text-sm font-medium text-gray-700'>
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
            <Button variant='ghost' size='sm' onClick={onClearSelection}>
              <Icons name='IconX' size={16} />
            </Button>
          </div>

          <div className='h-6 w-px bg-gray-300' />

          <div className='flex items-center space-x-2'>
            {onBulkStatusUpdate && (
              <Button variant='outline' size='sm' onClick={() => setShowStatusModal(true)}>
                <Icons name='IconEdit' size={16} className='mr-1' />
                Update Status
              </Button>
            )}

            {onBulkExport && (
              <Button variant='outline' size='sm' onClick={handleExport}>
                <Icons name='IconDownload' size={16} className='mr-1' />
                Export
              </Button>
            )}

            {onBulkDelete && (
              <Button variant='danger' size='sm' onClick={() => setShowDeleteConfirm(true)}>
                <Icons name='IconTrash' size={16} className='mr-1' />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        title='Confirm Bulk Delete'
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText='Delete'
        onConfirm={handleBulkDelete}
        confirmVariant='danger'
      >
        <p>
          Are you sure you want to delete {selectedItems.length} item
          {selectedItems.length !== 1 ? 's' : ''}? This action cannot be undone.
        </p>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        title='Update Status'
        onCancel={() => setShowStatusModal(false)}
      >
        <div className='space-y-4'>
          <p className='text-sm text-gray-600'>
            Select a new status for {selectedItems.length} item
            {selectedItems.length !== 1 ? 's' : ''}:
          </p>

          <div className='space-y-2'>
            <Button
              variant='outline'
              className='w-full justify-start'
              onClick={() => handleStatusUpdate(0)}
            >
              <Icons name='IconEdit' size={16} className='mr-2' />
              Draft
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start'
              onClick={() => handleStatusUpdate(1)}
            >
              <Icons name='IconCheck' size={16} className='mr-2' />
              Published
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start'
              onClick={() => handleStatusUpdate(2)}
            >
              <Icons name='IconArchive' size={16} className='mr-2' />
              Archived
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
