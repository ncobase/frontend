import React from 'react';

import { Modal, Icons, Badge } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useVersionComparison } from '../service';
import { FieldDifference } from '../version';

interface VersionComparisonProps {
  versionAId: string;
  versionBId: string;
  onClose: () => void;
}

export const VersionComparison: React.FC<VersionComparisonProps> = ({
  versionAId,
  versionBId,
  onClose
}) => {
  const { t } = useTranslation();
  const { data: comparison, isLoading } = useVersionComparison(versionAId, versionBId);

  const getDifferenceTypeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return 'IconPlus';
      case 'removed':
        return 'IconMinus';
      case 'modified':
        return 'IconEdit';
      default:
        return 'IconEqual';
    }
  };

  const getDifferenceTypeBadge = (type: string) => {
    const variants = {
      added: 'success',
      removed: 'danger',
      modified: 'warning',
      unchanged: 'secondary'
    };

    return (
      <Badge variant={variants[type] || 'secondary'} className='flex items-center gap-1'>
        <Icons name={getDifferenceTypeIcon(type)} size={12} />
        {t(`version.diff.${type}`)}
      </Badge>
    );
  };

  const renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className='text-gray-400 italic'>{t('version.diff.empty')}</span>;
    }
    if (typeof value === 'object') {
      return (
        <pre className='text-sm bg-gray-100 p-2 rounded'>{JSON.stringify(value, null, 2)}</pre>
      );
    }
    return <span className='font-mono text-sm'>{String(value)}</span>;
  };

  return (
    <Modal
      isOpen={true}
      title={t('version.compare.title')}
      onCancel={onClose}
      size='xl'
      className='max-h-[80vh]'
    >
      <div className='space-y-6'>
        {isLoading ? (
          <div className='flex items-center justify-center h-32'>
            <Icons name='IconLoader2' className='animate-spin' size={32} />
          </div>
        ) : comparison ? (
          <>
            {/* Comparison Header */}
            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
              <div className='text-center'>
                <div className='font-medium'>{t('version.compare.version_a')}</div>
                <div className='text-sm text-gray-600'>
                  v{comparison.version_a.version_number} • {comparison.version_a.created_at}
                </div>
              </div>
              <Icons name='IconArrowRight' size={20} className='text-gray-400' />
              <div className='text-center'>
                <div className='font-medium'>{t('version.compare.version_b')}</div>
                <div className='text-sm text-gray-600'>
                  v{comparison.version_b.version_number} • {comparison.version_b.created_at}
                </div>
              </div>
            </div>

            {/* Differences */}
            <div className='space-y-4 max-h-96 overflow-y-auto'>
              {comparison.differences.map((diff: FieldDifference, index) => (
                <div key={index} className='border border-gray-200 rounded-lg p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center space-x-2'>
                      <span className='font-medium'>{diff.field}</span>
                      {getDifferenceTypeBadge(diff.type)}
                    </div>
                    {diff.path && (
                      <span className='text-xs text-gray-500 font-mono'>{diff.path}</span>
                    )}
                  </div>

                  {diff.type !== 'unchanged' && (
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <div className='text-sm font-medium text-gray-700 mb-2'>
                          {t('version.diff.old_value')}
                        </div>
                        <div className='bg-red-50 border border-red-200 rounded p-2'>
                          {renderValue(diff.old_value)}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm font-medium text-gray-700 mb-2'>
                          {t('version.diff.new_value')}
                        </div>
                        <div className='bg-green-50 border border-green-200 rounded p-2'>
                          {renderValue(diff.new_value)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {comparison.differences.length === 0 && (
                <div className='text-center py-8 text-gray-500'>
                  <Icons name='IconEqual' size={32} className='mx-auto mb-2' />
                  <p>{t('version.compare.no_differences')}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='text-center py-8 text-gray-500'>
            <Icons name='IconAlertCircle' size={32} className='mx-auto mb-2' />
            <p>{t('version.compare.error')}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
