import { useState } from 'react';

import { Button, Icons, Form, Section } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Page, Topbar } from '@/components/layout';

interface SEOSettings {
  auto_analysis: boolean;
  analysis_frequency: string;
  default_focus_keywords: string[];
  meta_title_template: string;
  meta_description_template: string;
  og_image_default: string;
  enable_schema_markup: boolean;
  sitemap_auto_generate: boolean;
  robots_txt_auto_generate: boolean;
  canonical_domain: string;
}

export const SEOSettingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<SEOSettings>({
    defaultValues: {
      auto_analysis: true,
      analysis_frequency: 'daily',
      default_focus_keywords: [],
      meta_title_template: '{{title}} | {{site_name}}',
      meta_description_template: '{{excerpt}}',
      og_image_default: '',
      enable_schema_markup: true,
      sitemap_auto_generate: true,
      robots_txt_auto_generate: false,
      canonical_domain: 'https://example.com'
    }
  });

  const onSubmit = handleSubmit(async data => {
    setIsLoading(true);
    try {
      console.log('Saving SEO settings:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  });

  const generalFields = [
    {
      title: t('seo.settings.auto_analysis'),
      name: 'auto_analysis',
      type: 'switch',
      description: t('seo.settings.auto_analysis_desc')
    },
    {
      title: t('seo.settings.analysis_frequency'),
      name: 'analysis_frequency',
      type: 'select',
      options: [
        { label: t('seo.settings.frequency.daily'), value: 'daily' },
        { label: t('seo.settings.frequency.weekly'), value: 'weekly' },
        { label: t('seo.settings.frequency.monthly'), value: 'monthly' }
      ]
    },
    {
      title: t('seo.settings.canonical_domain'),
      name: 'canonical_domain',
      type: 'text',
      placeholder: 'https://example.com',
      description: t('seo.settings.canonical_domain_desc')
    }
  ];

  const templateFields = [
    {
      title: t('seo.settings.meta_title_template'),
      name: 'meta_title_template',
      type: 'text',
      placeholder: '{{title}} | {{site_name}}',
      description: t('seo.settings.template_variables')
    },
    {
      title: t('seo.settings.meta_description_template'),
      name: 'meta_description_template',
      type: 'text',
      placeholder: '{{excerpt}}',
      description: t('seo.settings.template_variables')
    },
    {
      title: t('seo.settings.og_image_default'),
      name: 'og_image_default',
      type: 'text',
      placeholder: 'https://example.com/default-og-image.jpg',
      description: t('seo.settings.og_image_default_desc')
    }
  ];

  const technicalFields = [
    {
      title: t('seo.settings.enable_schema_markup'),
      name: 'enable_schema_markup',
      type: 'switch',
      description: t('seo.settings.enable_schema_markup_desc')
    },
    {
      title: t('seo.settings.sitemap_auto_generate'),
      name: 'sitemap_auto_generate',
      type: 'switch',
      description: t('seo.settings.sitemap_auto_generate_desc')
    },
    {
      title: t('seo.settings.robots_txt_auto_generate'),
      name: 'robots_txt_auto_generate',
      type: 'switch',
      description: t('seo.settings.robots_txt_auto_generate_desc')
    }
  ];

  return (
    <Page
      sidebar
      title={t('seo.settings.title')}
      topbar={
        <Topbar
          title={t('seo.settings.description')}
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
            <Button onClick={onSubmit} size='sm' loading={isLoading} disabled={!isDirty}>
              <Icons name='IconCheck' size={16} className='mr-2' />
              {t('actions.save')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <Section
        title={t('seo.settings.general')}
        icon='IconSettings'
        className='mb-6 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md'
      >
        <Form control={control} errors={errors} fields={generalFields} className='space-y-4' />
      </Section>

      <Section
        title={t('seo.settings.templates')}
        icon='IconTemplate'
        className='mb-6 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md'
      >
        <Form control={control} errors={errors} fields={templateFields} className='space-y-4' />
      </Section>

      <Section
        title={t('seo.settings.technical')}
        icon='IconCode'
        className='mb-6 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md'
      >
        <Form control={control} errors={errors} fields={technicalFields} className='space-y-4' />
      </Section>
    </Page>
  );
};
