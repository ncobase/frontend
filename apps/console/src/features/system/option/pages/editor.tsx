import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { EditorOptionForms } from '../forms/editor';

import { useLayoutContext } from '@/components/layout';

export const EditorOptionPage = ({
  viewMode,
  record: initialRecord,
  onSubmit,
  control,
  setValue,
  errors
}) => {
  const { vmode } = useLayoutContext();
  const { id } = useParams<{ id: string }>();
  const record = initialRecord || id;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }

  if (mode === 'modal') {
    return (
      <EditorOptionForms
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
      <div className='bg-white sticky -top-4 py-2 right-0 left-0 border-b border-slate-100 pb-4 z-10'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <Button variant='outline' size='sm' onClick={() => navigate(-1)}>
              <Icons name='IconArrowLeft' size={16} className='mr-2' />
              Back
            </Button>
            <div className='text-slate-800 font-semibold text-lg'>
              {t('actions.edit', 'Edit')} {t('system.option.singular', 'Option')}
            </div>
          </div>
          <div className='flex gap-x-3'>
            <Button variant='outline' size='sm' onClick={() => navigate(-1)}>
              {t('actions.cancel', 'Cancel')}
            </Button>
            <Button onClick={onSubmit} size='sm' variant='primary'>
              {t('actions.save', 'Save')} {t('actions.changes', 'Changes')}
            </Button>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg p-6'>
        <EditorOptionForms
          record={record}
          onSubmit={onSubmit}
          control={control}
          setValue={setValue}
          errors={errors}
        />
      </div>
    </>
  );
};
