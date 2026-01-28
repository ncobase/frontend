import React, { useState } from 'react';

import { Button, Icons, Card } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { VersionHistory } from '../components/version_history';
import { VersionSelector } from '../components/version_selector';
import { useContentVersions } from '../service';
import { ContentVersion } from '../version';

import { Page, Topbar } from '@/components/layout';

export const VersionHistoryPage = () => {
  const { contentType, contentId } = useParams<{ contentType: string; contentId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);

  const { data: versionsData } = useContentVersions(contentId!, contentType!);
  const versions = versionsData?.items || [];
  const currentVersion = versions.find(v => v.is_current);

  const handleVersionSelect = (version: ContentVersion) => {
    setSelectedVersion(version);
  };

  return (
    <Page
      sidebar
      title={t('version.history.title')}
      topbar={
        <Topbar
          title={t('version.history.title')}
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate(`/content/${contentType}s/${contentId}`)}
              className='p-2'
            >
              <Icons name='IconArrowLeft' size={20} />
            </Button>
          ]}
          right={[
            <VersionSelector
              contentId={contentId!}
              contentType={contentType!}
              currentVersion={currentVersion}
              onVersionSelect={handleVersionSelect}
            />,
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate(`/content/version/settings`)}
            >
              <Icons name='IconSettings' size={16} className='mr-2' />
              {t('version.settings')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Current Version Info */}
      {currentVersion && (
        <Card className='p-6 bg-blue-50 border-blue-200'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'>
              <Icons name='IconGitBranch' size={24} className='text-white' />
            </div>
            <div>
              <h3 className='font-semibold text-blue-900'>
                {t('version.current')} v{currentVersion.version_number}
              </h3>
              <p className='text-blue-700 text-sm'>
                {currentVersion.change_summary || t('version.no_summary')}
              </p>
              <p className='text-blue-600 text-xs mt-1'>
                {t('version.created_by')}: {currentVersion.created_by} • {currentVersion.created_at}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Version History */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <VersionHistory
            contentId={contentId!}
            contentType={contentType!}
            onVersionSelect={handleVersionSelect}
            showActions={true}
          />
        </div>

        {/* Sidebar with Stats */}
        <div className='space-y-6'>
          <Card className='p-6'>
            <h4 className='font-semibold mb-4'>{t('version.statistics')}</h4>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>{t('version.total_versions')}</span>
                <span className='font-medium'>{versions.length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>{t('version.current_version')}</span>
                <span className='font-medium'>v{currentVersion?.version_number || 0}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>{t('version.last_updated')}</span>
                <span className='font-medium text-sm'>
                  {currentVersion?.created_at
                    ? new Date(currentVersion.created_at).toLocaleDateString()
                    : '-'}
                </span>
              </div>
            </div>
          </Card>

          {selectedVersion && (
            <Card className='p-6'>
              <h4 className='font-semibold mb-4'>{t('version.selected_version')}</h4>
              <div className='space-y-3'>
                <div>
                  <span className='text-gray-600 text-sm'>{t('version.version_number')}</span>
                  <p className='font-medium'>v{selectedVersion.version_number}</p>
                </div>
                <div>
                  <span className='text-gray-600 text-sm'>{t('version.change_type')}</span>
                  <p className='font-medium capitalize'>{selectedVersion.change_type}</p>
                </div>
                {selectedVersion.change_summary && (
                  <div>
                    <span className='text-gray-600 text-sm'>{t('version.summary')}</span>
                    <p className='text-sm'>{selectedVersion.change_summary}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
};
