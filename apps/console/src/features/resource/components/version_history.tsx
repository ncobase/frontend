import { useMemo, useRef, useState } from 'react';

import { Badge, Button, Icons, useToastMessage } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { downloadResourceFile } from '../file_actions';
import type { ResourceFile, ResourceRuntimePolicy, ResourceUsage } from '../resource';
import { DEFAULT_RESOURCE_RUNTIME_POLICY } from '../resource_policy';
import { useCreateVersion, useGetVersions } from '../service';
import {
  fileInputAcceptValue,
  formatBytes,
  normalizeAllowedResourceTypes,
  RESOURCE_MAX_UPLOAD_BYTES,
  summarizeAllowedResourceTypes
} from '../upload_payload';
import { getVersionUploadRejection, type VersionUploadRejection } from '../version_upload';

const formatFileSize = (bytes?: number) => {
  if (bytes === undefined || bytes === null) return '-';
  return formatBytes(bytes);
};

interface VersionHistoryProps {
  file: ResourceFile;
  policy?: ResourceRuntimePolicy;
  policyLoading?: boolean;
  usage?: ResourceUsage | null;
  onVersionCreated?: () => void;
}

const versionNumber = (version: ResourceFile, index: number) =>
  version.extras?.version_number || version.extras?.version || (index === 0 ? 'current' : index);

export const VersionHistory = ({
  file,
  policy,
  policyLoading,
  usage,
  onVersionCreated
}: VersionHistoryProps) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [downloadingVersionId, setDownloadingVersionId] = useState('');
  const { data: versions, isLoading, isError, refetch } = useGetVersions(file.id);
  const createVersionMutation = useCreateVersion();
  const runtimePolicy = policy || DEFAULT_RESOURCE_RUNTIME_POLICY;
  const maxUploadBytes = Math.max(
    1,
    Number(runtimePolicy.upload.max_upload_size) || RESOURCE_MAX_UPLOAD_BYTES
  );
  const allowedTypes = useMemo(
    () => normalizeAllowedResourceTypes(runtimePolicy.upload.allowed_types),
    [runtimePolicy.upload.allowed_types]
  );
  const acceptValue = useMemo(() => fileInputAcceptValue(allowedTypes), [allowedTypes]);
  const allowedTypesLabel = useMemo(
    () => summarizeAllowedResourceTypes(allowedTypes),
    [allowedTypes]
  );
  const quotaLabel = usage?.quota
    ? `${formatBytes(usage.usage)} / ${formatBytes(usage.quota)}`
    : t('resource.versions.quota_unknown', 'Checked by server');

  const describeRejection = (rejection: VersionUploadRejection) => {
    switch (rejection.code) {
      case 'empty':
        return t('resource.upload.invalid_empty', 'Empty file cannot be uploaded');
      case 'too_large':
        return t('resource.upload.invalid_large_with_limit', 'File exceeds {{limit}}.', {
          limit: formatBytes(rejection.limitBytes)
        });
      case 'type':
        return t('resource.upload.invalid_type_with_allowed', 'Allowed types: {{types}}.', {
          types: allowedTypesLabel
        });
      case 'quota':
        return t(
          'resource.upload.quota_exceeded_with_available',
          'Only {{available}} is available.',
          {
            available:
              rejection.availableBytes !== undefined
                ? formatBytes(rejection.availableBytes)
                : t('resource.upload.no_remaining_quota', 'no quota')
          }
        );
      default:
        return t('messages.unknown_error');
    }
  };

  const clearFileInput = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleCreateVersion = (selected?: FileList | null) => {
    const nextFile = selected?.[0];
    if (!nextFile) return;

    const rejection = getVersionUploadRejection(nextFile, runtimePolicy, usage);
    if (rejection) {
      clearFileInput();
      toast.error(t('messages.error'), {
        description: describeRejection(rejection)
      });
      return;
    }

    const data = new FormData();
    data.append('file', nextFile);
    createVersionMutation.mutate(
      { id: file.id, data },
      {
        onSuccess: async () => {
          toast.success(t('messages.success'), {
            description: t('resource.versions.create_success', 'New version uploaded')
          });
          clearFileInput();
          await refetch();
          onVersionCreated?.();
        },
        onError: (error: any) => {
          clearFileInput();
          toast.error(t('messages.error'), {
            description: error?.message || t('messages.unknown_error')
          });
        }
      }
    );
  };

  const handleDownloadVersion = async (version: ResourceFile) => {
    setDownloadingVersionId(version.id);
    try {
      await downloadResourceFile(version);
    } catch (error: any) {
      toast.error(t('messages.error'), {
        description: error?.message || t('messages.unknown_error')
      });
    } finally {
      setDownloadingVersionId('');
    }
  };

  if (isLoading) {
    return <div className='text-sm text-slate-400 py-4'>{t('common.loading', 'Loading...')}</div>;
  }

  const versionItems = Array.isArray(versions) && versions.length > 0 ? versions : [file];

  return (
    <div className='space-y-3'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h4 className='text-sm font-medium text-slate-700'>
            {t('resource.versions.title', 'Version History')}
          </h4>
          <p className='mt-1 text-xs text-slate-400'>
            {t(
              'resource.versions.description',
              'Upload a new file as a stored version of the current resource.'
            )}
          </p>
        </div>
        <Button
          size='sm'
          variant='outline-slate'
          onClick={() => inputRef.current?.click()}
          isLoading={createVersionMutation.isPending}
          disabled={policyLoading}
          startIcon={<Icons name='IconUpload' />}
        >
          {t('resource.versions.new', 'New version')}
        </Button>
        <input
          ref={inputRef}
          type='file'
          accept={acceptValue}
          className='hidden'
          onChange={event => handleCreateVersion(event.target.files)}
          disabled={createVersionMutation.isPending || policyLoading}
        />
      </div>

      <div className='grid grid-cols-1 gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 md:grid-cols-3'>
        <div>
          <span className='font-medium text-slate-700'>
            {t('resource.policy.max_upload', 'Upload limit')}
          </span>
          <p>{formatBytes(maxUploadBytes)}</p>
        </div>
        <div>
          <span className='font-medium text-slate-700'>
            {t('resource.policy.allowed_types', 'Allowed types')}
          </span>
          <p className='truncate' title={allowedTypesLabel}>
            {allowedTypesLabel}
          </p>
        </div>
        <div>
          <span className='font-medium text-slate-700'>{t('resource.policy.quota', 'Quota')}</span>
          <p>{policyLoading ? t('common.loading', 'Loading...') : quotaLabel}</p>
        </div>
      </div>

      {isError && (
        <div className='rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700'>
          {t('resource.versions.load_failed', 'Failed to load version history.')}
        </div>
      )}

      <div className='divide-y rounded-md border border-slate-200'>
        {versionItems.map((version: ResourceFile, index: number) => (
          <div key={version.id} className='flex items-center gap-3 px-3 py-3'>
            <Icons
              name={index === 0 ? 'IconCircleCheck' : 'IconCircle'}
              className={`h-4 w-4 shrink-0 ${index === 0 ? 'text-emerald-500' : 'text-slate-300'}`}
            />
            <div className='min-w-0 flex-1'>
              <div className='flex items-center gap-2'>
                <p className='truncate text-sm font-medium text-slate-700'>
                  {index === 0
                    ? t('resource.versions.current', 'Current file')
                    : t('resource.versions.version_label', 'Version {{version}}', {
                        version: versionNumber(version, index)
                      })}
                </p>
                {index === 0 && (
                  <Badge variant='success' size='xs'>
                    {t('resource.versions.current_badge', 'Current')}
                  </Badge>
                )}
              </div>
              <p className='truncate text-xs text-slate-400'>
                {version.original_name || version.name || version.id}
              </p>
              <p className='text-xs text-slate-400'>
                {formatFileSize(version.size)}
                {version.created_at &&
                  ` · ${formatDateTime(new Date(version.created_at), 'dateTime')}`}
              </p>
            </div>
            <div className='flex shrink-0 items-center gap-1'>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => handleDownloadVersion(version)}
                isLoading={downloadingVersionId === version.id}
                aria-label={t('resource.actions.download', 'Download')}
              >
                <Icons name='IconDownload' />
              </Button>
              {version.id !== file.id && (
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => navigate(`/res/view/${version.id}`)}
                  aria-label={t('actions.view', 'View')}
                >
                  <Icons name='IconExternalLink' />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {versionItems.length === 1 && !isError && (
        <div className='rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500'>
          {t('resource.versions.empty', 'No stored historical versions yet.')}
        </div>
      )}
    </div>
  );
};
