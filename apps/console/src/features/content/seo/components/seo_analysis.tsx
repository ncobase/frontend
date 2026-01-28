import React from 'react';

import { Card, Icons, Badge, Button, Progress } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { SEORecommendation } from '../seo';
import { useSEOAnalysis, useRunSEOAudit } from '../service';

interface SEOAnalysisProps {
  contentId: string;
  contentType: string;
}

export const SEOAnalysisComponent: React.FC<SEOAnalysisProps> = ({ contentId, contentType }) => {
  const { t } = useTranslation();

  const { data: analysis, isLoading, refetch } = useSEOAnalysis(contentId, contentType);
  const runAuditMutation = useRunSEOAudit();

  const handleRunAudit = async () => {
    try {
      await runAuditMutation.mutateAsync({ contentId, contentType });
      refetch();
    } catch (error) {
      console.error('Failed to run SEO audit:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return 'IconAlertTriangle';
      case 'important':
        return 'IconAlertCircle';
      default:
        return 'IconInfo';
    }
  };

  const getPriorityColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-red-600';
      case 'important':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-32'>
        <Icons name='IconLoader2' className='animate-spin' size={24} />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>{t('seo.analysis.title')}</h3>
        <Button onClick={handleRunAudit} loading={runAuditMutation.isPending} size='sm'>
          <Icons name='IconRefresh' size={16} className='mr-1' />
          {t('seo.analysis.run_audit')}
        </Button>
      </div>

      {analysis ? (
        <>
          {/* Overall Score */}
          <Card className='p-6'>
            <div className='text-center'>
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysis.overall_score)}`}>
                {analysis.overall_score}/100
              </div>
              <div className='text-gray-600 mb-4'>{t('seo.analysis.overall_score')}</div>
              <Progress
                value={analysis.overall_score}
                className='w-full'
                // variant={getScoreVariant(analysis.overall_score) as any}
              />
            </div>
          </Card>

          {/* Score Breakdown */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <Card className='p-4 text-center'>
              <div
                className={`text-2xl font-bold mb-1 ${getScoreColor(analysis.title_analysis.score)}`}
              >
                {analysis.title_analysis.score}
              </div>
              <div className='text-sm text-gray-600'>{t('seo.analysis.title')}</div>
            </Card>
            <Card className='p-4 text-center'>
              <div
                className={`text-2xl font-bold mb-1 ${getScoreColor(analysis.description_analysis.score)}`}
              >
                {analysis.description_analysis.score}
              </div>
              <div className='text-sm text-gray-600'>{t('seo.analysis.description')}</div>
            </Card>
            <Card className='p-4 text-center'>
              <div
                className={`text-2xl font-bold mb-1 ${getScoreColor(analysis.keyword_analysis.score)}`}
              >
                {analysis.keyword_analysis.score}
              </div>
              <div className='text-sm text-gray-600'>{t('seo.analysis.keywords')}</div>
            </Card>
            <Card className='p-4 text-center'>
              <div
                className={`text-2xl font-bold mb-1 ${getScoreColor(analysis.content_analysis.score)}`}
              >
                {analysis.content_analysis.score}
              </div>
              <div className='text-sm text-gray-600'>{t('seo.analysis.content')}</div>
            </Card>
          </div>

          {/* Content Analysis Details */}
          <Card className='p-6'>
            <h4 className='font-medium mb-4'>{t('seo.analysis.content_details')}</h4>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
              <div>
                <div className='text-gray-500'>{t('seo.analysis.word_count')}</div>
                <div className='font-medium'>{analysis.content_analysis.word_count}</div>
              </div>
              <div>
                <div className='text-gray-500'>{t('seo.analysis.readability')}</div>
                <div className='font-medium'>{analysis.content_analysis.readability_score}/100</div>
              </div>
              <div>
                <div className='text-gray-500'>{t('seo.analysis.internal_links')}</div>
                <div className='font-medium'>{analysis.content_analysis.internal_links}</div>
              </div>
              <div>
                <div className='text-gray-500'>{t('seo.analysis.images')}</div>
                <div className='font-medium'>
                  {analysis.content_analysis.images.with_alt}/
                  {analysis.content_analysis.images.total}
                </div>
              </div>
            </div>

            {/* Heading Structure */}
            <div className='mt-4 pt-4 border-t border-gray-200'>
              <h5 className='font-medium mb-2'>{t('seo.analysis.heading_structure')}</h5>
              <div className='flex space-x-4 text-sm'>
                <div>H1: {analysis.content_analysis.heading_structure.h1_count}</div>
                <div>H2: {analysis.content_analysis.heading_structure.h2_count}</div>
                <div>H3: {analysis.content_analysis.heading_structure.h3_count}</div>
              </div>
            </div>
          </Card>

          {/* Recommendations */}
          <Card className='p-6'>
            <h4 className='font-medium mb-4'>{t('seo.analysis.recommendations')}</h4>
            <div className='space-y-3'>
              {analysis.recommendations
                .sort((a, b) => b.priority - a.priority)
                .slice(0, 10)
                .map((rec: SEORecommendation, index) => (
                  <div key={index} className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Icons
                      name={getPriorityIcon(rec.type)}
                      size={16}
                      className={`mt-0.5 ${getPriorityColor(rec.type)}`}
                    />
                    <div className='flex-1'>
                      <div className='font-medium text-sm'>{rec.message}</div>
                      <div className='text-xs text-gray-600 mt-1'>{rec.action}</div>
                      <Badge variant='secondary' className='mt-2 text-xs'>
                        {t(`seo.category.${rec.category}`)}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </>
      ) : (
        <Card className='p-8 text-center'>
          <Icons name='IconSearchCheck' size={48} className='mx-auto text-gray-400 mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>{t('seo.analysis.no_data')}</h3>
          <p className='text-gray-500 mb-4'>{t('seo.analysis.no_data_description')}</p>
          <Button onClick={handleRunAudit} loading={runAuditMutation.isPending}>
            <Icons name='IconPlay' size={16} className='mr-1' />
            {t('seo.analysis.run_first_audit')}
          </Button>
        </Card>
      )}
    </div>
  );
};
