import React from 'react';

import { Button, Icons, Card } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { VersionComparison } from '../components/version_comparison';
import { useVersion } from '../service';

import { Page, Topbar } from '@/components/layout';

export const VersionComparisonPage = () => {
  const { contentType, contentId, versionA, versionB } = useParams<{
    contentType: string;
    contentId: string;
    versionA: string;
    versionB: string;
  }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: versionAData } = useVersion(versionA!);
  const { data: versionBData } = useVersion(versionB!);

  return (
    <Page
      sidebar
      title={t('version.compare.title')}
      topbar={
        <Topbar
          title={t('version.compare.title')}
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate(`/content/version/${contentType}/${contentId}/history`)}
              className='p-2'
            >
              <Icons name='IconArrowLeft' size={20} />
            </Button>
          ]}
          right={[
            <Button
              variant='ghost'
              onClick={() => navigate(`/content/version/${contentType}/${contentId}/history`)}
              className='p-2'
              size='sm'
            >
              <Icons name='IconHistory' size={20} />
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Header */}
      <div className='bg-white rounded-xl shadow-sm p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold text-gray-900'>{t('version.compare.title')}</h1>
            <p className='text-gray-500 mt-1'>
              {contentType} • {contentId}
            </p>
          </div>
        </div>
      </div>

      {/* Version Info Cards */}
      <div className='grid grid-cols-2 gap-6'>
        <Card className='p-6'>
          <div className='text-center'>
            <h3 className='font-semibold text-lg mb-2'>{t('version.compare.version_a')}</h3>
            {versionAData && (
              <div>
                <div className='text-2xl font-bold text-blue-600 mb-1'>
                  v{versionAData.version_number}
                </div>
                <div className='text-sm text-gray-600'>
                  {new Date(versionAData.created_at).toLocaleString()}
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  {t('version.created_by')}: {versionAData.created_by}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className='p-6'>
          <div className='text-center'>
            <h3 className='font-semibold text-lg mb-2'>{t('version.compare.version_b')}</h3>
            {versionBData && (
              <div>
                <div className='text-2xl font-bold text-green-600 mb-1'>
                  v{versionBData.version_number}
                </div>
                <div className='text-sm text-gray-600'>
                  {new Date(versionBData.created_at).toLocaleString()}
                </div>
                <div className='text-xs text-gray-500 mt-1'>
                  {t('version.created_by')}: {versionBData.created_by}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Comparison Component */}
      <VersionComparison
        versionAId={versionA!}
        versionBId={versionB!}
        onClose={() => navigate(`/content/version/${contentType}/${contentId}/history`)}
      />
    </Page>
  );
};
