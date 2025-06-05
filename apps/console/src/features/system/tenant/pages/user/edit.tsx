import { Button, Icons, ScrollView, Container } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { EditTenantUserForm } from '../../forms/user/edit';

import { useLayoutContext } from '@/components/layout';

export const EditTenantUserPage = ({
  viewMode,
  record: initialRecord,
  onSubmit,
  control,
  setValue,
  errors
}) => {
  const { vmode } = useLayoutContext();
  const { tenantId, userId } = useParams<{ tenantId: string; userId: string }>();
  const record = initialRecord || userId;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }

  if (mode === 'modal') {
    return (
      <EditTenantUserForm
        tenantId={tenantId}
        userId={record}
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
            <Button variant='outline-slate' onClick={() => navigate(-1)}>
              <Icons name='IconArrowLeft' />
            </Button>
            <div className='text-slate-600 font-medium'>{t('tenant.users.edit_title')}</div>
          </div>
          <div className='flex gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
              {t('actions.cancel')}
            </Button>
            <Button onClick={onSubmit} size='sm'>
              {t('actions.update')}
            </Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white'>
        <Container>
          <EditTenantUserForm
            tenantId={tenantId}
            userId={record}
            onSubmit={onSubmit}
            control={control}
            setValue={setValue}
            errors={errors}
          />
        </Container>
      </ScrollView>
    </>
  );
};
