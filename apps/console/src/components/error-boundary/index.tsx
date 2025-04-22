import { useEffect } from 'react';

import { Button, CodeHighlighter, Container, Dialog } from '@ncobase/react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import { ErrorPage } from '../errors';

import { eventEmitter } from '@/lib/events';

const FallbackComponent = ({
  error,
  children
}: {
  error?: FallbackProps;
  children?: React.ReactNode;
}) => {
  if (children) return <>{children}</>;
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
        <CodeHighlighter language='json' className='h-full my-0! text-wrap'>
          {/** @ts-ignore */}
          {error?.stack}
        </CodeHighlighter>
      </Dialog>
    </Container>
  );
};

export const ErrorBoundary: React.FC<React.PropsWithChildren> = props => {
  const handlerServerError = () => {
    return <FallbackComponent children={<ErrorPage code={500} />} />;
  };

  const handlerForbidden = () => {
    return <FallbackComponent children={<ErrorPage code={403} />} />;
  };

  useEffect(() => {
    eventEmitter.on('server-error', handlerServerError);
    eventEmitter.on('forbidden', handlerForbidden);
    return () => {
      eventEmitter.off('server-error', handlerServerError);
      eventEmitter.off('forbidden', handlerForbidden);
    };
  }, []);
  return <ReactErrorBoundary FallbackComponent={FallbackComponent} {...props} />;
};
