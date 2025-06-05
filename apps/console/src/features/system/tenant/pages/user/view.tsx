import { Button, Icons, ScrollView, Container } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { TenantUserViewerForm } from '../../forms/user/view';

import { useLayoutContext } from '@/components/layout';

export const TenantUserViewPage = ({ viewMode, record: initialRecord, handleView }) => {
  const { vmode } = useLayoutContext();
  const { tenantId, userId } = useParams<{ tenantId: string; userId: string }>();
  const record = initialRecord || userId;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }

  if (mode === 'modal') {
    return <TenantUserViewerForm tenantId={tenantId} userId={record} />;
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
            <div className='text-slate-600 font-medium'>{t('tenant.users.view_title')}</div>
          </div>
          <div className='flex gap-x-4'>
            <Button
              variant='outline-primary'
              prependIcon={<Icons name='IconEdit' className='w-4 h-4' />}
              onClick={() => handleView({ tenantId, userId: record }, `../edit`)}
              size='sm'
            >
              {t('actions.edit')}
            </Button>
            <Button
              variant='outline-slate'
              prependIcon={<Icons name='IconUserCheck' className='w-4 h-4' />}
              onClick={() => handleView({ tenantId, userId: record }, `../roles`)}
              size='sm'
            >
              {t('tenant.users.manage_roles')}
            </Button>
          </div>
        </div>
      </div>
      <ScrollView className='bg-white'>
        <Container>
          <TenantUserViewerForm tenantId={tenantId} userId={record} />
        </Container>
      </ScrollView>
    </>
  );
};
