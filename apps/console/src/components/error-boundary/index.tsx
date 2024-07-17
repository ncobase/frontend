import React, { useEffect } from 'react';

import { Button, CodeHighlighter, Container, Dialog } from '@ncobase/react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import { eventEmitter } from '@/helpers/events';

const FallbackComponent = ({ error }: FallbackProps) => {
  const { t } = useTranslation();
  return (
    <Container className='flex items-center justify-center w-lvw h-lvh'>
      <Dialog
        trigger={
          <Button variant='outline-danger' title={t('actions.expand')}>
            {t('errors.boundary.label')}
          </Button>
        }
        // title={error?.name}
        // description={error?.message}
      >
        <CodeHighlighter language='json' className='h-full !my-0 text-wrap'>
          {error?.stack}
        </CodeHighlighter>
      </Dialog>
    </Container>
  );
};

export const ErrorBoundary: React.FC<React.PropsWithChildren> = props => {
  const handlerServerError = () => {
    console.log('request error event: server-error');
  };
  const handlerForbidden = () => {
    console.log('request error event: forbidden');
  };
  const handlerUnauthorized = () => {
    console.log('request error event: unauthorized');
  };
  useEffect(() => {
    eventEmitter.on('server-error', handlerServerError);
    eventEmitter.on('unauthorized', handlerUnauthorized);
    eventEmitter.on('forbidden', handlerForbidden);

    return () => {
      eventEmitter.off('server-error', handlerServerError);
      eventEmitter.off('unauthorized', handlerUnauthorized);
      eventEmitter.off('forbidden', handlerForbidden);
    };
  }, []);
  return <ReactErrorBoundary FallbackComponent={FallbackComponent} {...props} />;
};
