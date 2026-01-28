import React from 'react';

import { Button, Icons } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { TemplateEditor } from '../components/template_editor';
import { useCreateTemplate } from '../service';
import { ContentTemplate } from '../template';

import { Page, Topbar } from '@/components/layout';

export const TemplateCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const createTemplateMutation = useCreateTemplate();

  const handleSave = async (templateData: Partial<ContentTemplate>) => {
    try {
      const result = await createTemplateMutation.mutateAsync(templateData as ContentTemplate);
      toast.success(t('template.create.success'));
      navigate(`/content/templates/${result.id}`);
    } catch (error) {
      toast.error(t('template.create.error'));
      console.error('Create template error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/content/templates');
  };

  return (
    <Page
      sidebar
      title={t('template.create.title')}
      topbar={
        <Topbar
          title={t('template.create.title')}
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/content/templates')}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
          ]}
          right={[]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4 z-10'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <div>
              <h1 className='text-xl font-semibold text-slate-900'>{t('template.create.title')}</h1>
              <p className='text-sm text-slate-600'>{t('template.create.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <TemplateEditor onSave={handleSave} onCancel={handleCancel} />
    </Page>
  );
};
