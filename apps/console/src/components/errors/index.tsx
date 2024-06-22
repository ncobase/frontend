import React from 'react';

import { useTranslation } from 'react-i18next';

import { Error403 } from '@/components/errors/403';
import { Error404 } from '@/components/errors/404';
import { Error500 } from '@/components/errors/500';
import { useAuthContext } from '@/features/account/context';
import { Page } from '@/layout';
import { ExplicitAny } from '@/types';

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
