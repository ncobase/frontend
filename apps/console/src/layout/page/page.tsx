import React, { useMemo, useState, useEffect } from 'react';

import { Shell } from '@ncobase/react';
import { locals } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useFocusMode } from '../layout.hooks';

import { PageContainer } from './page.container';
import { PageContext } from './page.context';
import { Header } from './page.header';
import { Sidebar } from './page.sidebar';
import { Submenu } from './page.submenu';
import { PageTitle } from './page.title';

const SIDEBAR_EXPANDED_KEY = 'app.sidebar.expanded';

export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: boolean;
  sidebar?: boolean;
  topbar?: React.ReactElement | React.ReactNode;
  submenu?: boolean;
  title?: string;
  layout?: boolean;
}

export const Page: React.FC<PageProps> = ({
  header = true,
  sidebar,
  topbar,
  submenu,
  title,
  layout = true,
  ...rest
}): JSX.Element => {
  useFocusMode();
  const { t } = useTranslation();
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const savedState = locals.get(SIDEBAR_EXPANDED_KEY);
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    locals.set(SIDEBAR_EXPANDED_KEY, JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

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
          sidebar={
            sidebar && <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
          }
          topbar={topbar}
          submenu={submenu && !sidebarExpanded && <Submenu />}
          sidebarExpanded={sidebarExpanded}
        >
          {renderContent()}
        </Shell>
      ) : (
        renderContent()
      )}
    </PageContext.Provider>
  );
};
