import React, { useState } from 'react';

import { Button, Icons, Badge, Card } from '@ncobase/react';
import { formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useContentVersions, useRestoreVersion } from '../service';
import { ContentVersion } from '../version';

import { VersionComparison } from './version_comparison';

interface VersionHistoryProps {
  contentId: string;
  contentType: string;
  onVersionSelect?: (_version: ContentVersion) => void;
  showActions?: boolean;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  contentId,
  contentType,
  onVersionSelect,
  showActions = true
}) => {
  const { t } = useTranslation();
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const { data: versionsData, isLoading } = useContentVersions(contentId, contentType);
  const restoreVersionMutation = useRestoreVersion();

  const versions = versionsData?.items || [];

  const handleVersionSelect = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(prev => prev.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions(prev => [...prev, versionId]);
    } else {
      setSelectedVersions([selectedVersions[1], versionId]);
    }
  };

  const handleRestore = async (version: ContentVersion) => {
    if (confirm(t('version.restore.confirm'))) {
      try {
        await restoreVersionMutation.mutateAsync({
          contentId,
          versionId: version.id!
        });
      } catch (error) {
        console.error('Failed to restore version:', error);
      }
    }
  };

  const getChangeTypeIcon = (changeType: string) => {
    switch (changeType) {
      case 'create':
        return 'IconPlus';
      case 'update':
        return 'IconEdit';
      case 'delete':
        return 'IconTrash';
      case 'publish':
        return 'IconEye';
      case 'unpublish':
        return 'IconEyeOff';
      case 'restore':
        return 'IconRestore';
      default:
        return 'IconCircle';
    }
  };

  const getChangeTypeBadge = (changeType: string) => {
    const variants = {
      create: 'success',
      update: 'primary',
      delete: 'danger',
      publish: 'warning',
      unpublish: 'secondary',
      restore: 'primary'
    };

    return (
      <Badge variant={variants[changeType] || 'secondary'} className='flex items-center gap-1'>
        <Icons name={getChangeTypeIcon(changeType)} size={12} />
        {t(`version.change_type.${changeType}`)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-32'>
        <Icons name='IconLoader2' className='animate-spin' size={24} />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>{t('version.history.title')}</h3>
        {selectedVersions.length === 2 && (
          <Button size='sm' onClick={() => setShowComparison(true)}>
            <Icons name='IconGitCompare' size={16} className='mr-1' />
            {t('version.compare.action')}
          </Button>
        )}
      </div>

      {/* Version List */}
      <div className='space-y-3'>
        {versions.map((version: ContentVersion) => (
          <Card
            key={version.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedVersions.includes(version.id!)
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleVersionSelect(version.id!)}
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center space-x-3 mb-2'>
                  <span className='bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded'>
                    v{version.version_number}
                  </span>
                  {getChangeTypeBadge(version.change_type)}
                  {version.is_current && <Badge variant='success'>{t('version.current')}</Badge>}
                </div>

                <div className='space-y-1'>
                  {version.title && <h4 className='font-medium text-gray-900'>{version.title}</h4>}
                  {version.change_summary && (
                    <p className='text-sm text-gray-600'>{version.change_summary}</p>
                  )}
                  <div className='flex items-center space-x-4 text-xs text-gray-500'>
                    <span>{formatRelativeTime(new Date(version.created_at))}</span>
                    <span>
                      {t('version.created_by')}: {version.created_by}
                    </span>
                  </div>
                </div>

                {version.tags && version.tags.length > 0 && (
                  <div className='flex flex-wrap gap-1 mt-2'>
                    {version.tags.map((tag, index) => (
                      <Badge key={index} variant='secondary' className='text-xs'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {showActions && (
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={e => {
                      e.stopPropagation();
                      onVersionSelect?.(version);
                    }}
                  >
                    <Icons name='IconEye' size={16} />
                  </Button>
                  {!version.is_current && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={e => {
                        e.stopPropagation();
                        handleRestore(version);
                      }}
                      loading={restoreVersionMutation.isPending}
                    >
                      <Icons name='IconRestore' size={16} />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {selectedVersions.includes(version.id!) && (
              <div className='mt-3 pt-3 border-t border-blue-200'>
                <div className='flex items-center text-sm text-blue-700'>
                  <Icons name='IconCheck' size={16} className='mr-1' />
                  {t('version.selected_for_comparison')}
                </div>
              </div>
            )}
          </Card>
        ))}

        {versions.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            <Icons name='IconHistory' size={32} className='mx-auto mb-2' />
            <p>{t('version.history.empty')}</p>
          </div>
        )}
      </div>

      {/* Version Comparison Modal */}
      {showComparison && selectedVersions.length === 2 && (
        <VersionComparison
          versionAId={selectedVersions[0]}
          versionBId={selectedVersions[1]}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};
