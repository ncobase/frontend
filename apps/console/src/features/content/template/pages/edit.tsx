import React from 'react';

import { Button, Icons, Container, ScrollView } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { TemplateEditor } from '../components/template_editor';
import { useTemplate, useUpdateTemplate } from '../service';
import { ContentTemplate } from '../template';

import { Page } from '@/components/layout';

export const TemplateEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const { data: template, isLoading } = useTemplate(id!);
  const updateTemplateMutation = useUpdateTemplate();

  const handleSave = async (templateData: Partial<ContentTemplate>) => {
    try {
      await updateTemplateMutation.mutateAsync({ ...templateData, id } as ContentTemplate);
      toast.success(t('template.edit.success'));
      navigate(`/content/templates/${id}`);
    } catch (error) {
      toast.error(t('template.edit.error'));
      console.error('Update template error:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/content/templates/${id}`);
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

  return (
    <Page sidebar>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4 z-10'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate(`/content/templates/${id}`)}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
            <div>
              <h1 className='text-xl font-semibold text-slate-900'>{t('template.edit.title')}</h1>
              <p className='text-sm text-slate-600'>{template?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollView className='bg-gray-50'>
        <Container className='max-w-6xl py-8'>
          <TemplateEditor template={template} onSave={handleSave} onCancel={handleCancel} />
        </Container>
      </ScrollView>
    </Page>
  );
};
