import React from 'react';

import { Button } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Error403 = ({ to = null }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className='flex flex-col mx-auto pt-20'>
      <div className='text-center font-medium text-6xl text-gradient'>{t('errors.403.title')}</div>
      <span className='mx-auto max-w-full/2 text-secondary-600 mt-12 mb-24'>
        {t('errors.403.description')}
      </span>
      <div className='flex items-center justify-center'>
        <Button onClick={() => (to ? navigate(to) : history.back())}>{t('actions.go_back')}</Button>
      </div>
    </div>
  );
};
