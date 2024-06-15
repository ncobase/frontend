import React from 'react';

import { Button, Form, TableView, TableViewProps } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { FullscreenView, FullscreenViewProps } from './fullscreen';
import { ModalViewProps, ModalView } from './modal';

import { Page, Topbar, useLayoutContext } from '@/layout';

export interface CommonProps<T extends object> {
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
  onQuery?: (query: ExplicitAny) => void;
  onResetQuery?: () => void;
}

// TODO: refactor, support side and fullscreen
export type CurdProps<T extends object> = CommonProps<T> &
  (ModalViewProps<T> | FullscreenViewProps<T>);

export const CurdView = <T extends object>({
  title,
  topbarTitle,
  topbarLeft,
  topbarRight,
  paginated = true,
  pageSize = 20,
  pageSizes = [5, 10, 20, 50, 100],
  selected,
  visibleControl = true,
  data = [],
  columns = [],
  queryFields = [],
  onQuery,
  onResetQuery,
  ...rest
}: CurdProps<T>) => {
  const { t } = useTranslation();
  const { vmode } = useLayoutContext();

  const QueryBar = () => {
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

  const Component = (type: string) => {
    switch (type) {
      case 'fullscreen':
        return <FullscreenView {...(rest as FullscreenViewProps<T>)} />;
      case 'modal':
      case 'default':
      default:
        return <ModalView {...(rest as ModalViewProps<T>)} />;
    }
  };

  return (
    <Page
      sidebar
      title={title}
      topbar={<Topbar title={topbarTitle || title} left={topbarLeft} right={topbarRight} />}
    >
      {queryFields.length > 0 && <QueryBar />}
      <TableView
        className='mt-4'
        data={data}
        paginated={paginated}
        pageSize={pageSize}
        pageSizes={pageSizes}
        paginationTexts={{
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
        }}
        emptyDataLabel={t('empty.no_data')}
        selected={selected}
        visibleControl={visibleControl}
        header={columns}
      />
      {Component(vmode)}
    </Page>
  );
};
