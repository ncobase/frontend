import React from 'react';

import { Button, Icons, Card, Badge } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { TemplatePreview } from '../components/template_preview';
import { useTemplate, useDuplicateTemplate } from '../service';

import { Page } from '@/components/layout';

export const TemplateViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: template, isLoading } = useTemplate(id!);
  const duplicateTemplateMutation = useDuplicateTemplate();

  const handleDuplicate = async () => {
    const name = prompt(t('template.duplicate.name_prompt'), `${template?.name} Copy`);
    if (name && template?.id) {
      try {
        const result = await duplicateTemplateMutation.mutateAsync({
          templateId: template.id,
          name
        });
        navigate(`/content/templates/${result.id}/edit`);
      } catch (error) {
        console.error('Failed to duplicate template:', error);
      }
    }
  };

  const handleUseTemplate = () => {
    if (template) {
      navigate(`/content/${template.type}s/create?template=${template.id}`);
    }
  };

  if (isLoading) {
    return (
      <Page sidebar>
        <div className='flex items-center justify-center h-64'>
          <Icons name='IconLoader2' className='animate-spin' size={32} />
        </div>
      </Page>
    );
  }

  if (!template) {
    return (
      <Page sidebar>
        <Card className='text-center py-12'>
          <Icons name='IconAlertCircle' size={48} className='mx-auto text-red-400 mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {t('template.not_found.title')}
          </h3>
          <p className='text-gray-500 mb-6'>{t('template.not_found.description')}</p>
          <Button onClick={() => navigate('/content/templates')}>
            {t('template.back_to_list')}
          </Button>
        </Card>
      </Page>
    );
  }

  return (
    <Page sidebar>
      <div className='space-y-6'>
        {/* Header */}
        <div className='bg-white rounded-xl shadow-sm p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                onClick={() => navigate('/content/templates')}
                className='p-2'
              >
                <Icons name='IconArrowLeft' size={20} />
              </Button>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
                  <Icons name='IconTemplate' size={32} className='text-white' />
                </div>
                <div>
                  <div className='flex items-center gap-3 mb-1'>
                    <h1 className='text-2xl font-bold text-gray-900'>{template.name}</h1>
                    <Badge variant='primary'>{t(`template.types.${template.type}`)}</Badge>
                    {template.category && (
                      <Badge variant='secondary'>
                        {t(`template.categories.${template.category}`)}
                      </Badge>
                    )}
                  </div>
                  <p className='text-gray-600'>{template.description}</p>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                onClick={handleDuplicate}
                loading={duplicateTemplateMutation.isPending}
              >
                <Icons name='IconCopy' size={16} className='mr-2' />
                {t('template.actions.duplicate')}
              </Button>
              <Button
                variant='outline'
                onClick={() => navigate(`/content/templates/${template.id}/edit`)}
              >
                <Icons name='IconEdit' size={16} className='mr-2' />
                {t('actions.edit')}
              </Button>
              <Button onClick={handleUseTemplate}>
                <Icons name='IconPlus' size={16} className='mr-2' />
                {t('template.actions.use')}
              </Button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Template Preview */}
          <div className='lg:col-span-2'>
            <TemplatePreview template={template} />
          </div>

          {/* Template Info Sidebar */}
          <div className='space-y-6'>
            {/* Template Details */}
            <Card className='p-6'>
              <h3 className='font-semibold mb-4'>{t('template.information.title')}</h3>
              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('template.fields.id')}
                  </label>
                  <p className='text-sm text-gray-900 font-mono'>{template.id}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('template.fields.type')}
                  </label>
                  <p className='text-sm text-gray-900'>{t(`template.types.${template.type}`)}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('template.fields.usage_count')}
                  </label>
                  <p className='text-sm text-gray-900'>
                    {template.usage_count} {t('template.times_used')}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('template.fields.created_at')}
                  </label>
                  <p className='text-sm text-gray-900'>{formatDateTime(template.created_at)}</p>
                </div>
                {template.updated_at && (
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      {t('template.fields.updated_at')}
                    </label>
                    <p className='text-sm text-gray-900'>{formatDateTime(template.updated_at)}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Template Fields */}
            <Card className='p-6'>
              <h3 className='font-semibold mb-4'>{t('template.fields.title')}</h3>
              <div className='space-y-3'>
                {template.fields.map((field, index) => (
                  <div key={index} className='border border-gray-200 rounded-lg p-3'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='font-medium text-sm'>{field.label}</span>
                      <Badge variant='secondary' className='text-xs'>
                        {t(`template.field_types.${field.type}`)}
                      </Badge>
                    </div>
                    <div className='text-xs text-gray-500'>
                      {field.name} {field.required && `• ${t('common.required')}`}
                    </div>
                    {field.description && (
                      <div className='text-xs text-gray-600 mt-1'>{field.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Template Tags */}
            {template.tags && template.tags.length > 0 && (
              <Card className='p-6'>
                <h3 className='font-semibold mb-4'>{t('template.tags')}</h3>
                <div className='flex flex-wrap gap-2'>
                  {template.tags.map((tag, index) => (
                    <Badge key={index} variant='secondary' className='text-xs'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};
