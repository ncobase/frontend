import { useMemo } from 'react';

import { Badge, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import {
  getMediaDisplayName,
  getResourceDisplayName,
  getTopicDisplayName,
  summarizeResourceDeleteImpacts
} from '../delete_impact';
import type { ResourceDeleteImpact, ResourceTopicReference } from '../delete_impact';

const getMediaIcon = (mediaType?: string) => {
  if (mediaType === 'image') return 'IconPhoto';
  if (mediaType === 'video') return 'IconMovie';
  if (mediaType === 'audio') return 'IconMusic';
  return 'IconFile';
};

const groupTopicReferencesByMedia = (references: ResourceTopicReference[]) =>
  references.reduce<Record<string, ResourceTopicReference[]>>((acc, reference) => {
    const mediaId = reference.media.id || reference.relation.media_id || '';
    if (!mediaId) return acc;
    acc[mediaId] = [...(acc[mediaId] || []), reference];
    return acc;
  }, {});

const SummaryItem = ({
  label,
  value,
  tone = 'slate'
}: {
  label: string;
  value: number;
  tone?: 'slate' | 'orange' | 'red' | 'green';
}) => {
  const toneClass = {
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
    orange: 'border-orange-200 bg-orange-50 text-orange-700',
    red: 'border-red-200 bg-red-50 text-red-700',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }[tone];

  return (
    <div className={`rounded-md border px-3 py-2 ${toneClass}`}>
      <span className='block text-lg font-semibold leading-5'>{value}</span>
      <span className='block text-xs'>{label}</span>
    </div>
  );
};

export const DeleteImpactPanel = ({
  impacts,
  loading,
  onOpenMedia,
  onOpenTopic
}: {
  impacts: ResourceDeleteImpact[];
  loading?: boolean;
  onOpenMedia: (_mediaId: string) => void;
  onOpenTopic: (_topicId: string) => void;
}) => {
  const { t } = useTranslation();
  const summary = useMemo(() => summarizeResourceDeleteImpacts(impacts), [impacts]);

  if (loading) {
    return (
      <div className='flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500'>
        <Icons name='IconLoader2' className='h-4 w-4 animate-spin' />
        {t('resource.references.loading', 'Checking references...')}
      </div>
    );
  }

  if (!impacts.length) return null;

  return (
    <div className='space-y-3'>
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
        <SummaryItem
          label={t('resource.references.files_checked', 'Files')}
          value={summary.fileCount}
        />
        <SummaryItem
          label={t('resource.references.media_refs', 'CMS media')}
          value={summary.mediaReferenceCount}
          tone={summary.mediaReferenceCount > 0 ? 'orange' : 'green'}
        />
        <SummaryItem
          label={t('resource.references.topic_refs', 'Topic uses')}
          value={summary.topicReferenceCount}
          tone={summary.topicReferenceCount > 0 ? 'orange' : 'green'}
        />
        <SummaryItem
          label={t('resource.references.check_errors', 'Errors')}
          value={summary.errorCount}
          tone={summary.errorCount > 0 ? 'red' : 'green'}
        />
      </div>

      {summary.canDelete ? (
        <div className='rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
          {t(
            'resource.references.none_found',
            'No CMS media or topic references were found for the selected file(s).'
          )}
        </div>
      ) : (
        <div className='rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700'>
          {summary.errorCount > 0
            ? t(
                'resource.references.check_error_blocked',
                'Deletion is blocked because reference checks did not complete.'
              )
            : t(
                'resource.references.delete_blocked',
                'Deletion is blocked until the listed CMS media references are removed.'
              )}
        </div>
      )}

      <div className='max-h-80 space-y-2 overflow-auto pr-1'>
        {impacts.map(impact => {
          const topicsByMedia = groupTopicReferencesByMedia(impact.topicReferences);
          const hasReferences =
            impact.mediaReferenceTotal > 0 ||
            impact.topicReferenceTotal > 0 ||
            impact.errors.length > 0;

          return (
            <div
              key={impact.file.id}
              className='rounded-md border border-slate-200 bg-white px-3 py-3'
            >
              <div className='flex items-start gap-2'>
                <Icons name='IconFile' className='mt-0.5 h-4 w-4 shrink-0 text-slate-500' />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium text-slate-700'>
                    {getResourceDisplayName(impact.file)}
                  </p>
                  <p className='truncate text-xs text-slate-400'>{impact.file.path}</p>
                </div>
                {hasReferences ? (
                  <Badge variant='warning' size='xs'>
                    {t('resource.references.blocked', 'Blocked')}
                  </Badge>
                ) : (
                  <Badge variant='success' size='xs'>
                    {t('resource.references.clear', 'Clear')}
                  </Badge>
                )}
              </div>

              {impact.errors.length > 0 && (
                <div className='mt-3 space-y-1 rounded-md border border-red-200 bg-red-50 px-3 py-2'>
                  {impact.errors.map((error, index) => (
                    <p key={`${impact.file.id}-error-${index}`} className='text-xs text-red-700'>
                      {error}
                    </p>
                  ))}
                </div>
              )}

              {impact.mediaReferences.length > 0 && (
                <div className='mt-3 space-y-2'>
                  {impact.mediaReferences.map(media => {
                    const mediaId = media.id || '';
                    const topicReferences = mediaId ? topicsByMedia[mediaId] || [] : [];

                    return (
                      <div
                        key={mediaId || getMediaDisplayName(media)}
                        className='rounded-md border border-slate-100 bg-slate-50 px-3 py-2'
                      >
                        <div className='flex items-start gap-2'>
                          <Icons
                            name={getMediaIcon(media.type)}
                            className='mt-0.5 h-4 w-4 shrink-0 text-slate-500'
                          />
                          <div className='min-w-0 flex-1'>
                            <button
                              type='button'
                              className='block max-w-full truncate text-left text-xs font-medium text-slate-700 underline-offset-2 hover:underline'
                              onClick={() => mediaId && onOpenMedia(mediaId)}
                            >
                              {getMediaDisplayName(media)}
                            </button>
                            <p className='truncate text-xs text-slate-400'>
                              {media.mime_type || media.resource?.type || media.type || mediaId}
                            </p>
                          </div>
                          <Badge
                            variant={topicReferences.length > 0 ? 'warning' : 'secondary'}
                            size='xs'
                          >
                            {t('resource.references.topic_count', '{{count}} topics', {
                              count: topicReferences.length
                            })}
                          </Badge>
                        </div>

                        {topicReferences.length > 0 && (
                          <div className='mt-2 flex flex-wrap gap-1.5'>
                            {topicReferences.map(reference => (
                              <button
                                key={
                                  reference.relation.id ||
                                  `${mediaId}-${reference.relation.topic_id}`
                                }
                                type='button'
                                className='rounded border border-orange-200 bg-white px-2 py-1 text-xs text-orange-700 underline-offset-2 hover:underline'
                                onClick={() =>
                                  reference.relation.topic_id &&
                                  onOpenTopic(reference.relation.topic_id)
                                }
                              >
                                {getTopicDisplayName(reference)}
                                {reference.relation.type ? ` · ${reference.relation.type}` : ''}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
