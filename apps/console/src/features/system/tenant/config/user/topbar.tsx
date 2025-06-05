import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { ScreenControl } from '@/components/elements';

export const topbarLeftSection = ({ handleView, handleBack }) => {
  const { t } = useTranslation();

  return [
    <div className='rounded-md flex items-center justify-between gap-x-2'>
      <Button
        variant='outline-slate'
        size='ratio'
        onClick={handleBack}
        className='flex items-center'
        title={t('actions.back_to_tenants')}
      >
        <Icons name='IconArrowLeft' />
      </Button>
      <Button
        variant='unstyle'
        size='ratio'
        onClick={() => handleView(null, 'create')}
        className='flex items-center'
        title={t('tenant.users.add_user')}
      >
        <Icons name='IconPlus' />
      </Button>
    </div>
  ];
};

export const topbarRightSection = [<ScreenControl />];
