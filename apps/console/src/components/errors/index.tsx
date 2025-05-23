import { ExplicitAny } from '@ncobase/types';
import { useTranslation } from 'react-i18next';

import { Error403 } from '@/components/errors/403';
import { Error404 } from '@/components/errors/404';
import { Error500 } from '@/components/errors/500';
import { Page } from '@/components/layout';
import { useAuthContext } from '@/features/account/context';

const ERROR_COMPONENTS: ExplicitAny = {
  403: Error403,
  404: Error404,
  500: Error500
};

export const ErrorPage = ({ code = 404, ...rest }) => {
  const { t } = useTranslation();
  const ErrorComponent = ERROR_COMPONENTS[code];

  const { isAuthenticated } = useAuthContext();

  return (
    <Page layout={isAuthenticated} title={t(`componnets:errorPage.${code}.label`)}>
      <ErrorComponent code={code} {...rest} />
    </Page>
  );
};
