import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
  search?: string;
  title?: string;
  status?: string;
  taxonomy?: string;
  private?: boolean | string;
  markdown?: boolean | string;
} & PaginationParams;

export const queryFields = ({
  queryControl
}: {
  queryControl: Control<QueryFormParams, ExplicitAny>;
}) => {
  const { t } = useTranslation();
  return [
    {
      name: 'search',
      label: t('topic.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('topic.placeholders.search', 'Search by title or content')}
              prependIcon='IconSearch'
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'title',
      label: t('topic.fields.title', 'Title'),
      component: (
        <Controller
          name='title'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('topic.placeholders.title', 'Filter by title')}
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'status',
      label: t('topic.fields.status', 'Status'),
      component: (
        <Controller
          name='status'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('topic.status.draft', 'Draft'), value: '0' },
                { label: t('topic.status.published', 'Published'), value: '1' },
                { label: t('topic.status.archived', 'Archived'), value: '2' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'private',
      label: t('topic.fields.visibility', 'Visibility'),
      component: (
        <Controller
          name='private'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('topic.visibility.public', 'Public'), value: 'false' },
                { label: t('topic.visibility.private', 'Private'), value: 'true' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    }
  ];
};
