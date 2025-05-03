import { useMemo } from 'react';

import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface PageTitleProps {
  suffix?: string;
  children?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ suffix = '', children = '' }) => {
  const { t } = useTranslation();
  const title = useMemo(
    () => `${children ? `${children} | ` : ''}${suffix || t('application_title')}`,
    [children, suffix, t]
  );

  return (
    <HelmetProvider>
      <Helmet>
        <title key='title'>{title}</title>
      </Helmet>
    </HelmetProvider>
  );
};
