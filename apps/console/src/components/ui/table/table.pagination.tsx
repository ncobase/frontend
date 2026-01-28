import React, { useCallback, useMemo } from 'react';

import { cn } from '@ncobase/utils';

import { useTable } from './table.context';

import { Button } from '@/components/ui/button';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/forms';
import { Icons } from '@/components/ui/icon';
import { Tooltip } from '@/components/ui/tooltip';

export interface IPaginationProps {
  className?: string;
  totalItems: number;
  pageSize: number;
  pageSizes: number[];
  currentPage: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
  // eslint-disable-next-line no-unused-vars
  onPageSizeChange: (size: number) => void;
  texts?: {
    firstPage?: string;
    previousPage?: string;
    nextPage?: string;
    lastPage?: string;
    totalText?: string;
    ofText?: string;
    goToText?: string;
    displayingText?: string;
    toText?: string;
    itemsText?: string;
    pageText?: string;
    perPageText?: string;
  };
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

const defaultTexts = {
  firstPage: 'First Page',
  previousPage: 'Previous Page',
  nextPage: 'Next Page',
  lastPage: 'Last Page',
  totalText: 'Total',
  ofText: 'of',
  goToText: 'Go to',
  displayingText: 'Displaying',
  toText: 'to',
  itemsText: 'items',
  pageText: 'Page',
  perPageText: 'Per Page'
};

export const Pagination: React.FC<IPaginationProps> = ({
  totalItems,
  pageSize,
  currentPage,
  pageSizes,
  onPageChange,
  onPageSizeChange,
  className,
  texts = {},
  hasNextPage,
  hasPrevPage
}) => {
  const {
    firstPage,
    previousPage,
    nextPage,
    lastPage,
    totalText,
    ofText,
    goToText,
    displayingText,
    toText,
    itemsText,
    pageText,
    perPageText
  } = { ...defaultTexts, ...texts };

  const { isBackendPagination } = useTable();

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );
  const startIndex = useMemo(
    () => Math.min((currentPage - 1) * pageSize + 1, totalItems),
    [currentPage, pageSize, totalItems]
  );
  const endIndex = useMemo(
    () => Math.min(currentPage * pageSize, totalItems),
    [currentPage, pageSize, totalItems]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    },
    [onPageChange, totalPages]
  );

  const handleJumpToPage = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const jumpInput = e.currentTarget.elements.namedItem('jumpInput') as HTMLInputElement;
      const pageNumber = parseInt(jumpInput.value, 10);
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        onPageChange(pageNumber);
      }
    },
    [onPageChange, totalPages]
  );

  const handlePageSizeChange = useCallback(
    (size: string) => {
      const newSize = parseInt(size, 10);
      const newTotalPages = Math.max(1, Math.ceil(totalItems / newSize));
      const newCurrentPage = Math.min(currentPage, newTotalPages);
      onPageSizeChange(newSize);
      if (newCurrentPage !== currentPage) {
        onPageChange(newCurrentPage);
      }
    },
    [onPageSizeChange, onPageChange, totalItems, currentPage, pageSize]
  );

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const classes = cn(
    'flex items-center justify-between px-2 py-2 shadow-[0_-1px_2px_0_rgba(0,0,0,0.03)] bg-white dark:bg-slate-900 dark:border-t dark:border-slate-700',
    className
  );

  return (
    <div className={classes}>
      <div className='flex items-center justify-between gap-3'>
        {!isBackendPagination && (
          <Tooltip content={firstPage} side='bottom'>
            <Button
              variant='slate'
              size='ratio'
              onClick={() => handlePageChange(1)}
              disabled={isFirstPage}
              className='dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
            >
              <Icons name='IconChevronLeftPipe' />
            </Button>
          </Tooltip>
        )}
        <Tooltip content={previousPage} side='bottom'>
          <Button
            variant='slate'
            size='ratio'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={
              (isBackendPagination && !hasPrevPage) || (!isBackendPagination && isFirstPage)
            }
            className='dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
          >
            <Icons name='IconChevronLeft' />
          </Button>
        </Tooltip>
      </div>
      <div className='flex items-center justify-center gap-x-1 text-slate-400 dark:text-slate-400'>
        {displayingText} <span className='font-bold'>{startIndex}</span> {toText}{' '}
        <span className='font-bold'>{endIndex}</span> {ofText}{' '}
        <span className='font-bold'>{totalItems}</span> {itemsText}
      </div>
      <div className='flex items-center justify-between gap-3'>
        <Tooltip content={nextPage} side='bottom'>
          <Button
            variant='slate'
            size='ratio'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={(isBackendPagination && !hasNextPage) || (!isBackendPagination && isLastPage)}
            className='dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
          >
            <Icons name='IconChevronRight' />
          </Button>
        </Tooltip>
        {!isBackendPagination && (
          <Tooltip content={lastPage} side='bottom'>
            <Button
              variant='slate'
              size='ratio'
              onClick={() => handlePageChange(totalPages)}
              disabled={isLastPage}
              className='dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200'
            >
              <Icons name='IconChevronRightPipe' />
            </Button>
          </Tooltip>
        )}
        {pageSizes.length > 1 && (
          <div className='flex items-center'>
            <span className='text-slate-400 dark:text-slate-400 text-nowrap mr-2'>
              {perPageText}
            </span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className='py-1.5 bg-slate-50 dark:bg-slate-800 dark:text-slate-200'>
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent className='dark:bg-slate-800 dark:border-slate-700'>
                {pageSizes.map(size => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className='dark:text-slate-200 dark:hover:bg-slate-700'
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {!isBackendPagination && totalPages > 1 && (
          <form onSubmit={handleJumpToPage} className='flex items-center gap-x-3'>
            <span className='text-slate-400 dark:text-slate-400 text-nowrap'>
              {totalText} {totalPages} {pageText}，{goToText}
            </span>
            <Input
              type='number'
              name='jumpInput'
              min='1'
              max={totalPages}
              defaultValue={currentPage.toString()}
              className='px-2 py-0.5 max-w-12 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
            />
            <span className='text-slate-400 dark:text-slate-400'>{pageText}</span>
          </form>
        )}
      </div>
    </div>
  );
};
