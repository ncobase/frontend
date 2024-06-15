import React from 'react';

import { Button } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

export const Error404 = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col mx-auto pt-20'>
      <div className='text-center font-medium text-6xl text-gradient drop-shadow-sm'>
        {t('errors.404.title')}
      </div>
      <span className='mx-auto max-w-full/2 text-secondary-600 mt-12 mb-24'>
        {t('errors.404.description')}
      </span>
      <div className='flex items-center justify-center'>
        <Button onClick={() => history.back()}>{t('actions.go_back')}</Button>
      </div>
    </div>
  );
};
