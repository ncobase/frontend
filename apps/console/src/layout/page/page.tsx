import React, { HtmlHTMLAttributes, useMemo } from 'react';

import { Shell } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { PageContainer } from './page.container';
import { PageContext } from './page.context';
import { Header } from './page.header';
import { Sidebar } from './page.sidebar';
import { PageTitle } from './page.title';

import { Submenu, useFocusMode } from '@/layout';

export interface PageProps extends React.PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>> {
  header?: boolean;
  sidebar?: boolean;
  topbar?: React.ReactElement | React.ReactNode;
  submenu?: boolean;
  title?: string;
  layout?: boolean;
}

export const Page: React.FC<PageProps> = ({
  header = true,
  topbar,
  sidebar,
  submenu,
  title,
  layout = true,
  ...rest
}): JSX.Element => {
  const { t } = useTranslation();

  useFocusMode();

  const pageContextValue = useMemo(
    () => ({ layout, header, topbar, sidebar, submenu }),
    [layout, header, topbar, sidebar, submenu]
  );

  const renderContent = () => <PageContainer {...rest} />;

  return (
    <PageContext.Provider value={pageContextValue}>
      <PageTitle suffix={t('application_title')}>{title}</PageTitle>
      {layout ? (
        <Shell
          header={header && <Header />}
          sidebar={sidebar && <Sidebar />}
          topbar={topbar}
          submenu={submenu && <Submenu />}
        >
          {renderContent()}
        </Shell>
      ) : (
        renderContent()
      )}
    </PageContext.Provider>
  );
};
