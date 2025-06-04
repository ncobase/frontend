import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { ActivityViewer, ActivityAnalytics } from '../components';

import { Page } from '@/components/layout';

export const ActivityListPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('logs');

  return (
    <Page sidebar className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>{t('activity.title')}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='w-full mb-4 justify-start'>
          <TabsTrigger value='logs'>{t('activity.tabs.logs')}</TabsTrigger>
          <TabsTrigger value='analytics'>{t('activity.tabs.analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value='logs'>
          <ActivityViewer />
        </TabsContent>

        <TabsContent value='analytics'>
          <ActivityAnalytics />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default ActivityListPage;
