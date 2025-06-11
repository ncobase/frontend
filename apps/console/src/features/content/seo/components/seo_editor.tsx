import React, { useState, useEffect } from 'react';

import { Button, Icons, Form, Section, Badge } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SEOData } from '../seo';
import { useContentSEO, useUpdateSEOData, useGenerateMetaTags } from '../service';

import { KeywordAnalyzer } from './keyword_analyzer';
import { SEOPreview } from './seo_preview';

interface SEOEditorProps {
  contentId: string;
  contentType: string;
  contentData?: any; // The actual content for analysis
  onSave?: (_data: SEOData) => void;
}

export const SEOEditor: React.FC<SEOEditorProps> = ({
  contentId,
  contentType,
  contentData,
  onSave
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'advanced'>('basic');
  const [showPreview, setShowPreview] = useState(false);

  const { data: seoData, isLoading } = useContentSEO(contentId, contentType);
  const updateSEOMutation = useUpdateSEOData();
  const generateMetaMutation = useGenerateMetaTags();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty }
  } = useForm<SEOData>({
    defaultValues: {
      content_id: contentId,
      content_type: contentType,
      meta_title: '',
      meta_description: '',
      meta_keywords: [],
      focus_keywords: [],
      robots_meta: ['index', 'follow']
    }
  });

  const watchedData = watch();

  useEffect(() => {
    if (seoData) {
      reset(seoData);
    }
  }, [seoData, reset]);

  const onSubmit = handleSubmit(async data => {
    try {
      await updateSEOMutation.mutateAsync(data);
      onSave?.(data);
    } catch (error) {
      console.error('Failed to save SEO data:', error);
    }
  });

  const handleGenerateMetaTags = async () => {
    if (!contentData?.content) return;

    try {
      const generated = await generateMetaMutation.mutateAsync({
        content: contentData.content,
        keywords: watchedData.focus_keywords
      });

      if (generated.meta_title) setValue('meta_title', generated.meta_title);
      if (generated.meta_description) setValue('meta_description', generated.meta_description);
      if (generated.og_title) setValue('og_title', generated.og_title);
      if (generated.og_description) setValue('og_description', generated.og_description);
    } catch (error) {
      console.error('Failed to generate meta tags:', error);
    }
  };

  const basicFields = [
    {
      title: t('seo.fields.meta_title'),
      name: 'meta_title',
      type: 'text',
      placeholder: t('seo.placeholders.meta_title'),
      description: t('seo.hints.meta_title'),
      rules: {
        maxLength: { value: 60, message: t('seo.validation.title_length') }
      }
    },
    {
      title: t('seo.fields.meta_description'),
      name: 'meta_description',
      type: 'textarea',
      rows: 3,
      placeholder: t('seo.placeholders.meta_description'),
      description: t('seo.hints.meta_description'),
      rules: {
        maxLength: { value: 160, message: t('seo.validation.description_length') }
      }
    },
    {
      title: t('seo.fields.canonical_url'),
      name: 'canonical_url',
      type: 'text',
      placeholder: t('seo.placeholders.canonical_url'),
      description: t('seo.hints.canonical_url')
    },
    {
      title: t('seo.fields.focus_keywords'),
      name: 'focus_keywords',
      type: 'tags',
      placeholder: t('seo.placeholders.focus_keywords'),
      description: t('seo.hints.focus_keywords')
    }
  ];

  const socialFields = [
    {
      title: t('seo.fields.og_title'),
      name: 'og_title',
      type: 'text',
      placeholder: t('seo.placeholders.og_title'),
      description: t('seo.hints.og_title')
    },
    {
      title: t('seo.fields.og_description'),
      name: 'og_description',
      type: 'textarea',
      rows: 3,
      placeholder: t('seo.placeholders.og_description'),
      description: t('seo.hints.og_description')
    },
    {
      title: t('seo.fields.og_image'),
      name: 'og_image',
      type: 'text',
      placeholder: t('seo.placeholders.og_image'),
      description: t('seo.hints.og_image')
    },
    {
      title: t('seo.fields.twitter_card'),
      name: 'twitter_card',
      type: 'select',
      options: [
        { label: t('seo.twitter_card.summary'), value: 'summary' },
        { label: t('seo.twitter_card.summary_large_image'), value: 'summary_large_image' },
        { label: t('seo.twitter_card.app'), value: 'app' },
        { label: t('seo.twitter_card.player'), value: 'player' }
      ]
    },
    {
      title: t('seo.fields.twitter_title'),
      name: 'twitter_title',
      type: 'text',
      placeholder: t('seo.placeholders.twitter_title')
    },
    {
      title: t('seo.fields.twitter_description'),
      name: 'twitter_description',
      type: 'textarea',
      rows: 2,
      placeholder: t('seo.placeholders.twitter_description')
    }
  ];

  const advancedFields = [
    {
      title: t('seo.fields.robots_meta'),
      name: 'robots_meta',
      type: 'checkbox-group',
      options: [
        { label: 'index', value: 'index' },
        { label: 'noindex', value: 'noindex' },
        { label: 'follow', value: 'follow' },
        { label: 'nofollow', value: 'nofollow' },
        { label: 'noarchive', value: 'noarchive' },
        { label: 'nosnippet', value: 'nosnippet' }
      ]
    },
    {
      title: t('seo.fields.schema_markup'),
      name: 'schema_markup',
      type: 'textarea',
      rows: 8,
      placeholder: t('seo.placeholders.schema_markup'),
      description: t('seo.hints.schema_markup')
    }
  ];

  const tabs = [
    { key: 'basic', label: t('seo.tabs.basic'), icon: 'IconTag' },
    { key: 'social', label: t('seo.tabs.social'), icon: 'IconShare' },
    { key: 'advanced', label: t('seo.tabs.advanced'), icon: 'IconSettings' }
  ];

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
        <h3 className='text-lg font-medium'>{t('seo.editor.title')}</h3>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' size='sm' onClick={() => setShowPreview(!showPreview)}>
            <Icons name='IconEye' size={16} className='mr-1' />
            {t('seo.preview.toggle')}
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleGenerateMetaTags}
            loading={generateMetaMutation.isPending}
            disabled={!contentData?.content}
          >
            <Icons name='IconWand' size={16} className='mr-1' />
            {t('seo.generate.meta_tags')}
          </Button>
          <Button onClick={onSubmit} loading={updateSEOMutation.isPending} disabled={!isDirty}>
            <Icons name='IconCheck' size={16} className='mr-1' />
            {t('actions.save')}
          </Button>
        </div>
      </div>

      {/* Content Length Indicators */}
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
          <span className='text-sm font-medium'>{t('seo.length.title')}</span>
          <Badge
            variant={
              !watchedData.meta_title
                ? 'secondary'
                : watchedData.meta_title.length > 60
                  ? 'danger'
                  : watchedData.meta_title.length > 50
                    ? 'warning'
                    : 'success'
            }
          >
            {watchedData.meta_title?.length || 0}/60
          </Badge>
        </div>
        <div className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'>
          <span className='text-sm font-medium'>{t('seo.length.description')}</span>
          <Badge
            variant={
              !watchedData.meta_description
                ? 'secondary'
                : watchedData.meta_description.length > 160
                  ? 'danger'
                  : watchedData.meta_description.length > 140
                    ? 'warning'
                    : 'success'
            }
          >
            {watchedData.meta_description?.length || 0}/160
          </Badge>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* SEO Form */}
        <div className='lg:col-span-2'>
          {/* Tab Navigation */}
          <div className='flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6'>
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
          <div className='space-y-6'>
            {activeTab === 'basic' && (
              <Section
                title={t('seo.sections.basic')}
                icon='IconTag'
                className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
              >
                <Form
                  control={control}
                  errors={errors}
                  fields={basicFields}
                  className='space-y-4'
                />
              </Section>
            )}

            {activeTab === 'social' && (
              <Section
                title={t('seo.sections.social')}
                icon='IconShare'
                className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
              >
                <Form
                  control={control}
                  errors={errors}
                  fields={socialFields}
                  className='space-y-4'
                />
              </Section>
            )}

            {activeTab === 'advanced' && (
              <Section
                title={t('seo.sections.advanced')}
                icon='IconSettings'
                className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
              >
                <Form
                  control={control}
                  errors={errors}
                  fields={advancedFields}
                  className='space-y-4'
                />
              </Section>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* SEO Preview */}
          {showPreview && <SEOPreview seoData={watchedData} />}

          {/* Keyword Analyzer */}
          {contentData?.content && watchedData.focus_keywords?.length > 0 && (
            <KeywordAnalyzer content={contentData.content} keywords={watchedData.focus_keywords} />
          )}
        </div>
      </div>
    </div>
  );
};
