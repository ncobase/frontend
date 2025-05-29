import { Button } from '@ncobase/react';

import { useTranslation } from '@/lib/i18n';

export const NetworkError = ({ onRetry }: { onRetry?: () => void }) => {
  const { t } = useTranslation();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoBack = () => {
    try {
      window.history.back();
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (e) {
      window.location.href = '/';
    }
  };

  return (
    <div className='flex flex-col mx-auto pt-20 min-h-[60vh] justify-center items-center'>
      <div className='text-center font-medium text-6xl leading-20 text-gradient mb-8'>
        {t('errors.network.title', 'Network Error')}
      </div>
      <span className='mx-auto max-w-md text-secondary-600 mt-4 mb-12 text-center'>
        {t(
          'errors.network.description',
          'Unable to connect to the server. Please check your internet connection and try again.'
        )}
      </span>
      <div className='flex items-center justify-center gap-4'>
        <Button onClick={handleRetry}>{t('actions.retry', 'Retry')}</Button>
        <Button variant='outline' onClick={handleGoBack}>
          {t('actions.go_back', 'Go Back')}
        </Button>
      </div>
    </div>
  );
};
