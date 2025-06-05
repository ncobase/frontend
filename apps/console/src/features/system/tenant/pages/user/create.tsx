import { Button, Icons, ScrollView, Container } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { CreateTenantUserForm } from '../../forms/user/create';

import { useLayoutContext } from '@/components/layout';

export const CreateTenantUserPage = ({ viewMode, onSubmit, control, errors }) => {
  const { vmode } = useLayoutContext();
  const { tenantId } = useParams<{ tenantId: string }>();
  const mode = viewMode || vmode || 'flatten';

  if (mode === 'modal') {
    return (
      <CreateTenantUserForm
        tenantId={tenantId}
        onSubmit={onSubmit}
        control={control}
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
            <div className='text-slate-600 font-medium'>{t('tenant.users.create_title')}</div>
          </div>
          <div className='flex gap-x-4'>
            <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
              {t('actions.cancel')}
            </Button>
            <Button onClick={onSubmit} size='sm'>
              {t('actions.create')}
            </Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white'>
        <Container>
          <CreateTenantUserForm
            tenantId={tenantId}
            onSubmit={onSubmit}
            control={control}
            errors={errors}
          />
        </Container>
      </ScrollView>
    </>
  );
};
