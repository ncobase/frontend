import { Button } from '@ncobase/react';
import { useNavigate } from 'react-router';

import { useTranslation } from '@/lib/i18n';

export const Error403 = ({ to = null, onRetry }: { to?: string | null; onRetry?: () => void }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (to) {
      navigate(to);
    } else {
      try {
        window.history.back();
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (e) {
        navigate('/');
      }
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className='flex flex-col mx-auto pt-20 min-h-[60vh] justify-center items-center'>
      <div className='text-center font-medium text-6xl leading-20 text-gradient mb-8'>
        {t('errors.403.title')}
      </div>
      <span className='mx-auto max-w-md text-secondary-600 mt-4 mb-12 text-center'>
        {t('errors.403.description')}
      </span>
      <div className='flex items-center justify-center gap-4'>
        <Button onClick={handleRetry}>{t('actions.retry')}</Button>
        <Button variant='outline' onClick={handleGoBack}>
          {t('actions.go_back')}
        </Button>
      </div>
    </div>
  );
};
