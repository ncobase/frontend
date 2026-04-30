import { lazy, Suspense, useState } from 'react';

import { Button } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { Page, Topbar } from '@/components/layout';
import { Spinner } from '@/components/loading/spinner';

const BusinessDashboard = lazy(() =>
  import('./business').then(module => ({ default: module.BusinessDashboard }))
);
const ChartDashboard = lazy(() =>
  import('./chart-dashboard').then(module => ({ default: module.ChartDashboard }))
);
const ECommerceDashboard = lazy(() =>
  import('./e-commerce').then(module => ({ default: module.ECommerceDashboard }))
);
const OperationsDashboard = lazy(() =>
  import('./monitoring').then(module => ({ default: module.OperationsDashboard }))
);

const tabs = [
  { id: 'ecommerce', label: 'E-Commerce', component: ECommerceDashboard },
  { id: 'business', label: 'Business Dashboard', component: BusinessDashboard },
  { id: 'chart', label: 'Chart Dashboard', component: ChartDashboard },
  { id: 'operations', label: 'Operations', component: OperationsDashboard }
];

export const TabSwitchBar = ({ activeTab, onTabChange = undefined, ...rest }) => {
  const { t } = useTranslation();

  return (
    <Topbar {...rest} className='justify-center'>
      <div className='rounded-md w-full flex'>
        {tabs.map(item => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'primary' : 'outline-slate'}
            className={`${
              activeTab === item.id ? '' : 'bg-white'
            } -ms-px rounded-none first:rounded-s-lg first:ms-0 flex-auto last:rounded-e-lg ${
              activeTab === item.id ? 'border border-slate-200/65' : ''
            }`}
            onClick={() => onTabChange(item)}
          >
            {t(item.label)}
          </Button>
        ))}
      </div>
    </Topbar>
  );
};

export const AnalyzesPage = () => {
  const [activeTab, setActiveTab] = useState('ecommerce');
  const [activeTabTitle, setActiveTabTitle] = useState('');

  const onTabChange = tab => {
    setActiveTab(tab.id);
    setActiveTabTitle(tab.label);
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || null;

  return (
    <Page
      title={activeTabTitle}
      topbar={<TabSwitchBar activeTab={activeTab} onTabChange={onTabChange} />}
    >
      <Suspense fallback={<Spinner />}>{ActiveComponent && <ActiveComponent />}</Suspense>
    </Page>
  );
};
