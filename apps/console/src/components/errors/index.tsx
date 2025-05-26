import { ExplicitAny } from '@ncobase/types';

import { Error403 } from '@/components/errors/403';
import { Error404 } from '@/components/errors/404';
import { Error500 } from '@/components/errors/500';
import { NetworkError } from '@/components/errors/network';
import { Page } from '@/components/layout';
import { useAuthContext } from '@/features/account/context';
import { useTranslation } from '@/lib/i18n';

const ERROR_COMPONENTS: ExplicitAny = {
  403: Error403,
  404: Error404,
  500: Error500,
  network: NetworkError
};

export const ErrorPage = ({
  code = 404,
  onRetry,
  ...rest
}: {
  code?: number | string;
  onRetry?: () => void;
  [key: string]: any;
}) => {
  const { t } = useTranslation();
  const ErrorComponent = ERROR_COMPONENTS[code] || Error404;
  const { isAuthenticated } = useAuthContext();
  return (
    <Page
      layout={isAuthenticated}
      title={t(`componnets:errorPage.${code}.label`)}
      sidebar={false}
      submenu={false}
    >
      <ErrorComponent code={code} onRetry={onRetry} {...rest} />
    </Page>
  );
};
