import React, { useEffect } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { SEOAnalysisComponent } from '../components/seo_analysis';
import { SEOEditor } from '../components/seo_editor';
import { useRunSEOAudit } from '../service';

import { Page, Topbar } from '@/components/layout';

export const SEOAuditPage = () => {
  const { contentType, contentId } = useParams<{ contentType: string; contentId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<'analysis' | 'editor'>('analysis');

  const runAuditMutation = useRunSEOAudit();

  useEffect(() => {
    // Auto-run audit when page loads
    if (contentId && contentType) {
      runAuditMutation.mutate({ contentId, contentType });
    }
  }, [contentId, contentType]);

  const tabs = [
    { key: 'analysis', label: t('seo.audit.analysis'), icon: 'IconSearchCheck' },
    { key: 'editor', label: t('seo.audit.editor'), icon: 'IconEdit' }
  ];

  return (
    <Page
      sidebar
      title={t('seo.audit.title')}
      topbar={
        <Topbar
          title={t('seo.audit.title')}
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/content/seo')}
              className='p-2'
            >
              <Icons name='IconArrowLeft' size={20} />
            </Button>
          ]}
          right={[
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                runAuditMutation.mutate({ contentId: contentId!, contentType: contentType! })
              }
              loading={runAuditMutation.isPending}
            >
              <Icons name='IconRefresh' size={16} className='mr-2' />
              {t('seo.audit.refresh')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Tab Navigation */}
      <div className='flex space-x-1 bg-gray-100 p-1 rounded-lg'>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }
              `}
          >
            <Icons name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'analysis' && (
          <SEOAnalysisComponent contentId={contentId!} contentType={contentType!} />
        )}

        {activeTab === 'editor' && <SEOEditor contentId={contentId!} contentType={contentType!} />}
      </div>
    </Page>
  );
};
