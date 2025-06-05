import { Button, ScrollView } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { EditTenantForm } from '../forms/editor';

import { useLayoutContext } from '@/components/layout';

export const EditorTenantPage = ({
  viewMode,
  record: initialRecord,
  onSubmit,
  control,
  setValue,
  errors
}) => {
  const { vmode } = useLayoutContext();
  const { slug } = useParams<{ slug: string }>();
  const record = initialRecord || slug;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }
  if (mode === 'modal') {
    return (
      <EditTenantForm
        record={record}
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />
    );
  }

  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <div className='text-slate-600 font-medium'>{t('actions.edit')}</div>
          </div>
          <div className='flex gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
              {t('actions.cancel')}
            </Button>
            <Button onClick={onSubmit} size='sm'>
              {t('actions.submit')}
            </Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white p-4'>
        <EditTenantForm
          record={record}
          onSubmit={onSubmit}
          control={control}
          setValue={setValue}
          errors={errors}
        />
      </ScrollView>
    </>
  );
};
