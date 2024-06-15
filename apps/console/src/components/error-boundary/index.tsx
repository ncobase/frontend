import React from 'react';

import { Container, Dialog, Button, CodeHighlighter } from '@ncobase/react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

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
  return <ReactErrorBoundary FallbackComponent={FallbackComponent} {...props} />;
};
