import React, { useState } from 'react';

import { Button, Icons, Card, Form, Section } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Page, Topbar } from '@/components/layout';

interface VersionSettings {
  auto_versioning: boolean;
  max_versions: number;
  retention_days: number;
  compress_old_versions: boolean;
  notify_on_restore: boolean;
  require_change_summary: boolean;
  enable_auto_cleanup: boolean;
}

export const VersionSettingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<VersionSettings>({
    defaultValues: {
      auto_versioning: true,
      max_versions: 50,
      retention_days: 365,
      compress_old_versions: true,
      notify_on_restore: true,
      require_change_summary: false,
      enable_auto_cleanup: true
    }
  });

  const onSubmit = handleSubmit(async data => {
    setIsLoading(true);
    try {
      // Save settings logic here
      console.log('Saving version settings:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  });

  const generalFields = [
    {
      title: t('version.settings.auto_versioning'),
      name: 'auto_versioning',
      type: 'switch',
      description: t('version.settings.auto_versioning_desc')
    },
    {
      title: t('version.settings.require_change_summary'),
      name: 'require_change_summary',
      type: 'switch',
      description: t('version.settings.require_change_summary_desc')
    },
    {
      title: t('version.settings.notify_on_restore'),
      name: 'notify_on_restore',
      type: 'switch',
      description: t('version.settings.notify_on_restore_desc')
    }
  ];

  const storageFields = [
    {
      title: t('version.settings.max_versions'),
      name: 'max_versions',
      type: 'number',
      description: t('version.settings.max_versions_desc'),
      rules: { min: { value: 1, message: t('validation.min', { min: 1 }) } }
    },
    {
      title: t('version.settings.retention_days'),
      name: 'retention_days',
      type: 'number',
      description: t('version.settings.retention_days_desc'),
      rules: { min: { value: 1, message: t('validation.min', { min: 1 }) } }
    },
    {
      title: t('version.settings.compress_old_versions'),
      name: 'compress_old_versions',
      type: 'switch',
      description: t('version.settings.compress_old_versions_desc')
    },
    {
      title: t('version.settings.enable_auto_cleanup'),
      name: 'enable_auto_cleanup',
      type: 'switch',
      description: t('version.settings.enable_auto_cleanup_desc')
    }
  ];

  return (
    <Page
      sidebar
      title={t('version.settings.title')}
      topbar={
        <Topbar
          title={t('version.settings.title')}
          left={[
            <Button variant='ghost' onClick={() => navigate(-1)} className='p-2' size='sm'>
              <Icons name='IconArrowLeft' size={20} />
            </Button>
          ]}
          right={[
            <Button onClick={onSubmit} loading={isLoading} disabled={!isDirty} size='sm'>
              <Icons name='IconCheck' size={16} className='mr-2' />
              {t('actions.save')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <Section
        title={t('version.settings.general')}
        icon='IconSettings'
        className='mb-6 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md'
      >
        <Form control={control} errors={errors} fields={generalFields} className='space-y-4' />
      </Section>

      <Section
        title={t('version.settings.storage')}
        icon='IconDatabase'
        className='mb-6 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md'
      >
        <Form control={control} errors={errors} fields={storageFields} className='space-y-4' />
      </Section>

      {/* Storage Usage */}
      <Card className='p-6'>
        <h3 className='font-semibold mb-4'>{t('version.settings.storage_usage')}</h3>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-gray-600'>{t('version.settings.total_versions')}</span>
            <span className='font-medium'>1,234</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>{t('version.settings.storage_used')}</span>
            <span className='font-medium'>2.5 GB</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600'>{t('version.settings.compressed_versions')}</span>
            <span className='font-medium'>856</span>
          </div>
        </div>

        <div className='mt-4 pt-4 border-t'>
          <Button variant='outline' size='sm' className='w-full'>
            <Icons name='IconBroom' size={16} className='mr-2' />
            {t('version.settings.cleanup_old_versions')}
          </Button>
        </div>
      </Card>
    </Page>
  );
};
