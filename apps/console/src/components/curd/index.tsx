import React, { useMemo } from 'react';

import { Button, Form, TableView, TableViewProps } from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { FlattenView, FlattenViewProps } from './flatten';
import { ModalView, ModalViewProps } from './modal';

import { Page, Topbar, useLayoutContext } from '@/layout';

export interface CommonProps<T extends object> {
  viewMode?: 'modal' | 'flatten';
  title?: string;
  topbarTitle?: string;
  topbarLeft?: React.ReactNode[];
  topbarRight?: React.ReactNode[];
  paginated?: TableViewProps['paginated'];
  pageSize?: TableViewProps['pageSize'];
  pageSizes?: TableViewProps['pageSizes'];
  selected?: TableViewProps['selected'];
  visibleControl?: TableViewProps['visibleControl'];
  data?: T[];
  columns?: TableViewProps['header'];
  queryFields?: {
    name: string;
    label: string;
    component: React.ReactNode;
  }[];
  onQuery?: (query: any) => void;
  onResetQuery?: () => void;
  fetchData?: TableViewProps['fetchData'];
}

export type CurdProps<T extends object> = CommonProps<T> &
  (ModalViewProps<T> | FlattenViewProps<T>);

const QueryBar = ({
  queryFields = [],
  onQuery,
  onResetQuery,
  t
}: {
  queryFields: {
    name: string;
    label: string;
    component: React.ReactNode;
  }[];
  onQuery?: (query: any) => void;
  onResetQuery?: () => void;
  t: any;
}) => {
  if (!queryFields.length) return null;

  return (
    <Form
      id='querybar-form'
      onSubmit={onQuery}
      noValidate
      className='flex bg-white shadow-sm -mx-4 -mt-4 p-4'
    >
      <div className='flex-1 items-center justify-between grid grid-cols-12 gap-4'>
        <div
          className={cn(
            'col-span-full md:col-span-11 grid gap-4',
            queryFields.length === 2 && 'sm:grid-cols-2',
            queryFields.length === 3 && 'sm:grid-cols-2 md:grid-cols-3',
            queryFields.length >= 4 && 'md:grid-cols-3 lg:grid-cols-4'
          )}
        >
          {queryFields.map(({ name, label, component }) => (
            <div key={name} className='inline-flex items-center'>
              <div className='flex text-slate-800'>{label}：</div>
              <div className='flex-1 gap-x-4 pl-4'>{component}</div>
            </div>
          ))}
        </div>
        <div className='col-span-1 flex flex-row items-center justify-start gap-x-4 flex-wrap'>
          <Button onClick={onQuery} type='submit'>
            {t('query.search')}
          </Button>
          <Button onClick={onResetQuery} variant='outline-slate'>
            {t('query.reset')}
          </Button>
        </div>
      </div>
    </Form>
  );
};

const PaginationTexts = (t: any) => ({
  firstPage: t('pagination.first_page'),
  previousPage: t('pagination.previous_page'),
  nextPage: t('pagination.next_page'),
  lastPage: t('pagination.last_page'),
  totalText: t('pagination.total_text'),
  ofText: t('pagination.of_text'),
  goToText: t('pagination.go_to_text'),
  displayingText: t('pagination.displaying_text'),
  toText: t('pagination.to_text'),
  itemsText: t('pagination.items_text'),
  pageText: t('pagination.page_text'),
  perPageText: t('pagination.per_page_text')
});

const renderTopbar = (mode: string, type: string | undefined) =>
  mode === 'modal' || (mode === 'flatten' && !type);

const renderQueryBar = (mode: string, queryFieldsLength: number, type: string | undefined) =>
  queryFieldsLength > 0 && (mode === 'modal' || (mode === 'flatten' && !type));

const renderTableView = (mode: string, type: string | undefined) =>
  mode === 'modal' || (mode === 'flatten' && !type);

export const CurdView = <T extends object>({
  viewMode,
  type,
  title,
  topbarTitle,
  topbarLeft,
  topbarRight,
  paginated = true,
  pageSize,
  pageSizes = [5, 10, 20, 50, 100],
  selected,
  visibleControl = true,
  data = [],
  columns = [],
  queryFields = [],
  onQuery,
  onResetQuery,
  fetchData,
  ...rest
}: CurdProps<T>) => {
  const { t } = useTranslation();
  const { vmode } = useLayoutContext();
  const mode = viewMode || vmode;

  const tableViewProps = useMemo(
    () => ({
      data,
      paginated,
      pageSize,
      pageSizes,
      selected,
      visibleControl,
      header: columns,
      className: cn(queryFields.length && 'mt-4'),
      fetchData,
      paginationTexts: PaginationTexts(t),
      emptyDataLabel: t('empty.no_data')
    }),
    [
      data,
      paginated,
      pageSize,
      pageSizes,
      selected,
      visibleControl,
      columns,
      queryFields.length,
      fetchData,
      t
    ]
  );

  const renderMode = (mode: string) => {
    switch (mode) {
      case 'modal':
        return <ModalView type={type} {...(rest as ModalViewProps<T>)} />;
      case 'flatten':
        return <FlattenView type={type} {...(rest as FlattenViewProps<T>)} />;
      case 'default':
      default:
        return <FlattenView type={type} {...(rest as FlattenViewProps<T>)} />;
    }
  };

  return (
    <Page
      sidebar
      title={title}
      topbar={
        renderTopbar(mode, type) && (
          <Topbar title={topbarTitle || title} left={topbarLeft} right={topbarRight} />
        )
      }
    >
      {renderQueryBar(mode, queryFields.length, type) && (
        <QueryBar queryFields={queryFields} onQuery={onQuery} onResetQuery={onResetQuery} t={t} />
      )}
      {renderTableView(mode, type) && <TableView {...tableViewProps} />}
      {renderMode(mode)}
    </Page>
  );
};
