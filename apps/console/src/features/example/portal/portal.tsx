import React, { useRef, useState } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Switch,
  Portal
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { Page, Topbar } from '@/components/layout';

export const PortalExample: React.FC = () => {
  const { t } = useTranslation();
  const [showBasicPortal, setShowBasicPortal] = useState(false);
  const [showCustomPortal, setShowCustomPortal] = useState(false);
  const [disablePortal, setDisablePortal] = useState(false);
  const customContainerRef = useRef<HTMLDivElement>(null);

  return (
    <Page title={t('example.portal_demo')} topbar={<Topbar title={t('example.portal_demo')} />}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-6'>
        {/* Basic Portal Demo */}
        <Card>
          <CardHeader>
            <CardTitle>{t('example.basic_portal')}</CardTitle>
            <CardDescription>{t('example.basic_portal_description')}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm'>{t('example.basic_portal_explanation')}</p>

            <div className='overflow-hidden border border-slate-200 rounded-md p-4 h-32 relative'>
              <p className='text-slate-500'>{t('example.parent_container')}</p>

              <Button onClick={() => setShowBasicPortal(!showBasicPortal)} className='mt-2'>
                {showBasicPortal
                  ? t('example.hide_portal_content')
                  : t('example.show_portal_content')}
              </Button>

              {showBasicPortal && (
                <Portal>
                  <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg border border-slate-200 z-50 min-w-[300px]'>
                    <h3 className='text-lg font-medium mb-2'>{t('example.portal_content')}</h3>
                    <p className='mb-4 text-sm text-slate-600'>
                      {t('example.portal_renders_outside')}
                    </p>
                    <Button onClick={() => setShowBasicPortal(false)} className='w-full'>
                      {t('example.close')}
                    </Button>
                  </div>
                  <div
                    className='fixed inset-0 bg-black bg-opacity-25 z-40'
                    onClick={() => setShowBasicPortal(false)}
                  />
                </Portal>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Custom Container Portal Demo */}
        <Card>
          <CardHeader>
            <CardTitle>{t('example.custom_container_portal')}</CardTitle>
            <CardDescription>{t('example.custom_container_description')}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm'>{t('example.custom_container_explanation')}</p>

            <div className='overflow-hidden border border-slate-200 rounded-md p-4 h-32 relative'>
              <p className='text-slate-500'>{t('example.parent_container')}</p>

              <Button onClick={() => setShowCustomPortal(!showCustomPortal)} className='mt-2'>
                {showCustomPortal
                  ? t('example.hide_portal_content')
                  : t('example.show_portal_content')}
              </Button>

              {/* Custom container for portal */}
              <div
                ref={customContainerRef}
                className='mt-4 border border-dashed border-blue-300 p-2 rounded-sm bg-blue-50 h-20 relative'
              >
                <p className='text-blue-600'>{t('example.custom_container_target')}</p>
              </div>

              {showCustomPortal && (
                <Portal container={customContainerRef.current}>
                  <div className='absolute inset-0 flex items-center justify-center bg-blue-100 rounded-sm'>
                    <div className='bg-white p-3 rounded-sm shadow-md text-center'>
                      <p className='text-sm font-medium'>{t('example.custom_portal_content')}</p>
                      <Button
                        size='sm'
                        variant='outline-primary'
                        onClick={() => setShowCustomPortal(false)}
                        className='mt-2'
                      >
                        {t('example.close')}
                      </Button>
                    </div>
                  </div>
                </Portal>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Disable Portal Demo */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>{t('example.disable_portal')}</CardTitle>
            <CardDescription>{t('example.disable_portal_description')}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <p className='text-sm'>{t('example.disable_portal_explanation')}</p>
              <Switch checked={disablePortal} onCheckedChange={setDisablePortal} />
            </div>

            <div className='overflow-hidden border border-slate-200 rounded-md p-4 relative'>
              <p className='text-slate-500 mb-4'>{t('example.parent_container')}</p>

              <div className='bg-slate-100 p-4 h-32 overflow-auto'>
                <p className='text-slate-500 mb-2'>{t('example.scrollable_container')}</p>

                <Portal disablePortal={disablePortal}>
                  <div className='bg-emerald-100 border border-emerald-300 p-3 rounded-md my-3'>
                    <p className='text-sm font-medium text-emerald-800'>
                      {disablePortal
                        ? t('example.rendering_inline')
                        : t('example.rendering_in_portal')}
                    </p>
                    <p className='text-emerald-700 mt-1'>
                      {disablePortal
                        ? t('example.affected_by_parent_overflow')
                        : t('example.escapes_parent_overflow')}
                    </p>
                  </div>
                </Portal>

                <div className='h-64 flex items-end'>
                  <p className='text-slate-400'>{t('example.scroll_down')}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className='text-slate-500'>{t('example.portal_usage_tip')}</p>
          </CardFooter>
        </Card>
      </div>
    </Page>
  );
};
