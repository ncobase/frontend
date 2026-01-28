import { InputField, PaginationParams, SelectField } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type QueryFormParams = {
  search?: string;
  category?: string;
  storage?: string;
  access_level?: string;
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
      label: t('resource.fields.search', 'Search'),
      component: (
        <Controller
          name='search'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <InputField
              placeholder={t('resource.placeholders.search', 'Search by filename')}
              prependIcon='IconSearch'
              className='py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'category',
      label: t('resource.fields.category', 'Category'),
      component: (
        <Controller
          name='category'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('resource.category.image', 'Image'), value: 'image' },
                { label: t('resource.category.document', 'Document'), value: 'document' },
                { label: t('resource.category.video', 'Video'), value: 'video' },
                { label: t('resource.category.audio', 'Audio'), value: 'audio' },
                { label: t('resource.category.archive', 'Archive'), value: 'archive' },
                { label: t('resource.category.other', 'Other'), value: 'other' }
              ]}
              className='[&>button]:py-1.5'
              {...field}
            />
          )}
        />
      )
    },
    {
      name: 'access_level',
      label: t('resource.fields.access_level', 'Access'),
      component: (
        <Controller
          name='access_level'
          control={queryControl}
          defaultValue=''
          render={({ field }) => (
            <SelectField
              allowClear
              options={[
                { label: t('resource.access.public', 'Public'), value: 'public' },
                { label: t('resource.access.private', 'Private'), value: 'private' },
                { label: t('resource.access.shared', 'Shared'), value: 'shared' }
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
