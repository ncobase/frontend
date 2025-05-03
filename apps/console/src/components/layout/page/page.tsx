import { useMemo } from 'react';

import { Shell } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useFocusMode } from '../layout.hooks';

import { PageContainer } from './page.container';
import { PageContext } from './page.context';
import { Header } from './page.header';
import { Sidebar } from './page.sidebar';
import { Submenu } from './page.submenu';
import { PageTitle } from './page.title';

import { useLocalStorage } from '@/hooks/use_local_storage';

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
}) => {
  useFocusMode();
  const { t } = useTranslation();

  // Use our custom localStorage hook
  const { storedValue: sidebarExpanded, setValue: setSidebarExpanded } = useLocalStorage(
    SIDEBAR_EXPANDED_KEY,
    false
  );

  const pageContextValue = useMemo(
    () => ({ layout, header, topbar, sidebar, submenu }),
    [layout, header, topbar, sidebar, submenu]
  );

  const renderContent = () => <PageContainer {...rest} />;

  // Get document direction once, don't recalculate on every render
  const documentDirection = useMemo(
    () => (document.documentElement.dir || 'ltr') as 'ltr' | 'rtl',
    []
  );

  return (
    <PageContext.Provider value={pageContextValue}>
      <PageTitle suffix={t('application_title')}>{title}</PageTitle>
      {layout ? (
        <Shell
          header={header && <Header />}
          sidebar={
            sidebar && (
              <Sidebar
                expanded={sidebarExpanded}
                setExpanded={value => setSidebarExpanded(value as boolean)}
              />
            )
          }
          topbar={topbar}
          submenu={submenu && !sidebarExpanded && <Submenu />}
          sidebarExpanded={sidebarExpanded}
          direction={documentDirection}
        >
          {renderContent()}
        </Shell>
      ) : (
        renderContent()
      )}
    </PageContext.Provider>
  );
};
