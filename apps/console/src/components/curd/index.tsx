import { useMemo, useState } from 'react';

import { Button, Form, Icons, TableView, TableViewProps } from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { CommonViewProps } from './common';
import { FlattenView } from './flatten';
import { ModalView } from './modal';

import { Page, Topbar, useLayoutContext } from '@/components/layout';
import { PREFERENCES_VIEW_MODE_KEY } from '@/components/preferences';
import { useLocalStorage } from '@/hooks/use_local_storage';

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
  expandComponent?: TableViewProps['expandComponent'];
  maxTreeLevel?: TableViewProps['maxTreeLevel'];
  isAllExpanded?: TableViewProps['isAllExpanded'];
  data?: T[];
  columns?: TableViewProps['header'];
  queryFields?: {
    name: string;
    label: string;
    component: React.ReactNode;
  }[];
  onQuery?: (_query: any) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onResetQuery?: () => void;
  fetchData?: TableViewProps['fetchData'];
  loading?: boolean;
}

// Merge common props with either ModalViewProps or FlattenViewProps
export type CurdProps<T extends object> = CommonProps<T> &
  CommonViewProps<T> & {
    record?: T | null;
  };

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
  onQuery?: (_query: any) => void;
  onResetQuery?: () => void;
  t: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!queryFields.length) return null;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Form
      id='querybar-form'
      onSubmit={onQuery}
      noValidate
      className='flex bg-white shadow-xs -mx-4 -mt-4 p-4 relative'
    >
      <div className='flex-1 items-start justify-between grid grid-cols-12 gap-4'>
        <div
          className={cn(
            'col-span-full md:col-span-11 grid gap-4',
            queryFields.length === 2 && 'sm:grid-cols-2',
            queryFields.length === 3 && 'sm:grid-cols-2 md:grid-cols-3',
            queryFields.length >= 4 && 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          )}
        >
          {queryFields
            .slice(0, isExpanded ? queryFields.length : 3)
            .map(({ name, label, component }) => (
              <div key={name} className='inline-flex items-center'>
                <div className='flex text-slate-800'>{label}：</div>
                <div className='flex-1 gap-x-4 pl-4'>{component}</div>
              </div>
            ))}
          {queryFields.length > 3 && (
            <Button
              variant='unstyle'
              size='ratio'
              className='absolute -bottom-2 left-1/2 -translate-x-1/2 z-9999 bg-white hover:bg-slate-50 [&>svg]:stroke-slate-500 [&>svg]:hover:stroke-slate-600 shadow-[0_1px_3px_0_rgba(0,0,0,0.10)] rounded-full p-0.5 border border-transparent'
              title={t(isExpanded ? 'query.collapse' : 'query.expand')}
              onClick={toggleExpand}
            >
              <Icons name={isExpanded ? 'IconChevronUp' : 'IconChevronDown'} size={12} />
            </Button>
          )}
        </div>
        <div className='col-span-full md:col-span-1 flex flex-row items-start pt-[5.5px] justify-start gap-x-4 flex-wrap'>
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
  loading,
  expandComponent,
  maxTreeLevel,
  isAllExpanded,
  onConfirm,
  record,
  createComponent,
  viewComponent,
  editComponent,
  ...rest
}: CurdProps<T>) => {
  const { t } = useTranslation();
  const { vmode } = useLayoutContext();

  // Use the stored preference or fallback to the context value
  const { storedValue: preferredViewMode } = useLocalStorage(PREFERENCES_VIEW_MODE_KEY, null);
  const mode = viewMode || preferredViewMode || vmode || 'flatten';

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
      loading,
      expandComponent,
      maxTreeLevel,
      isAllExpanded,
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
      loading,
      expandComponent,
      maxTreeLevel,
      isAllExpanded,
      t
    ]
  );

  const shouldRenderTopbar = mode === 'modal' || (mode === 'flatten' && !type);
  const shouldRenderQueryBar =
    queryFields.length > 0 && (mode === 'modal' || (mode === 'flatten' && !type));
  const shouldRenderTableView = mode === 'modal' || (mode === 'flatten' && !type);

  // Prepare common view props that will be shared by both ModalView and FlattenView
  const commonViewProps = {
    type,
    createComponent,
    viewComponent,
    editComponent,
    record,
    onConfirm
  };

  const renderViewComponent = () => {
    switch (mode) {
      case 'modal':
        // @ts-expect-error
        return <ModalView {...commonViewProps} {...rest} />;
      case 'flatten':
      default:
        return <FlattenView {...commonViewProps} />;
    }
  };

  return (
    <Page
      sidebar
      title={title}
      topbar={
        shouldRenderTopbar && (
          <Topbar title={topbarTitle || title} left={topbarLeft} right={topbarRight} />
        )
      }
    >
      {shouldRenderQueryBar && (
        <QueryBar queryFields={queryFields} onQuery={onQuery} onResetQuery={onResetQuery} t={t} />
      )}
      {shouldRenderTableView && <TableView {...tableViewProps} />}
      {renderViewComponent()}
    </Page>
  );
};
