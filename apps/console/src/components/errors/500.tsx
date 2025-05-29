import { Button } from '@ncobase/react';
import { useNavigate } from 'react-router';

import { useTranslation } from '@/lib/i18n';

export const Error500 = ({
  trace = null,
  to = null,
  onRetry
}: {
  trace?: string | null;
  to?: string | null;
  onRetry?: () => void;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (to) {
      navigate(to);
    } else {
      try {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          navigate('/');
        }
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (e) {
        navigate('/');
      }
    }
  };

  const handleRefresh = () => {
    if (onRetry) {
      onRetry();
    } else {
      try {
        window.location.reload();
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      } catch (e) {
        // eslint-disable-next-line no-self-assign
        window.location.href = window.location.href;
      }
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className='flex flex-col mx-auto pt-20 min-h-[60vh] justify-center items-center'>
      <div className='text-center font-medium text-6xl leading-20 text-gradient mb-8'>
        {t('errors.500.title', '500')}
      </div>

      <div className='text-center text-2xl font-semibold text-gray-700 mb-4'>
        {t('errors.500.heading', 'Internal Server Error')}
      </div>

      <span className='mx-auto max-w-md text-secondary-600 text-center mb-12'>
        {t(
          'errors.500.description',
          'Something went wrong on our servers. Please try again later or contact support if the problem persists.'
        )}
      </span>

      {trace && (
        <div className='mx-auto max-w-md mb-8'>
          <details className='bg-white rounded-lg border p-4'>
            <summary className='cursor-pointer text-sm font-medium text-gray-700 mb-2'>
              {t('errors.500.technical_details', 'Technical Details')}
            </summary>
            <div className='text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded mt-2'>
              Request ID: {trace}
            </div>
          </details>
        </div>
      )}

      <div className='flex items-center justify-center gap-4 flex-wrap'>
        <Button onClick={handleRefresh} className='min-w-24'>
          {t('actions.refresh', 'Refresh')}
        </Button>

        <Button onClick={handleGoBack} variant='outline' className='min-w-24'>
          {t('actions.go_back', 'Go Back')}
        </Button>

        <Button onClick={handleGoHome} variant='outline' className='min-w-24'>
          {t('actions.go_home', 'Go Home')}
        </Button>
      </div>

      <div className='text-center text-sm text-gray-500 mt-12'>
        {t(
          'errors.500.support_text',
          'If this problem continues, please contact our support team.'
        )}
      </div>
    </div>
  );
};
