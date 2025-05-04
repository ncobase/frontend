import { useMemo, useCallback, useState, useEffect } from 'react';

import { TableView, TableViewProps } from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { CommonViewProps } from './common';
import { FlattenView } from './flatten';
import { ModalView } from './modal';
import { QueryBar } from './querybar';

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

export type CurdProps<T extends object> = CommonProps<T> &
  CommonViewProps<T> & {
    record?: T | null;
  };

const PaginationTexts = (t: TFunction) => ({
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
  isAllExpanded: propIsAllExpanded,
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

  const [isAllExpanded, setIsAllExpanded] = useState(!!propIsAllExpanded);

  useEffect(() => {
    if (propIsAllExpanded !== undefined) {
      setIsAllExpanded(!!propIsAllExpanded);
    }
  }, [propIsAllExpanded]);

  const memoizedExpandComponent = useMemo(() => expandComponent, [expandComponent]);

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
      expandComponent: memoizedExpandComponent,
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
      memoizedExpandComponent,
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
  const commonViewProps = useMemo(
    () => ({
      type,
      createComponent,
      viewComponent,
      editComponent,
      record,
      onConfirm
    }),
    [type, createComponent, viewComponent, editComponent, record, onConfirm]
  );

  const renderViewComponent = useCallback(() => {
    switch (mode) {
      case 'modal':
        // @ts-expect-error
        return <ModalView {...commonViewProps} {...rest} />;
      case 'flatten':
      default:
        return <FlattenView {...commonViewProps} />;
    }
  }, [mode, commonViewProps, rest]);

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
