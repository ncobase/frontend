import React from 'react';

import { Button, Container, Icons, ScrollView } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { WorkflowDesigner } from '../components/designer';
import { useCreateWorkflow } from '../service';
import { Workflow } from '../workflow';

import { Page } from '@/components/layout';

export const WorkflowCreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const createWorkflowMutation = useCreateWorkflow();

  const handleSave = async (workflowData: Partial<Workflow>) => {
    try {
      await createWorkflowMutation.mutateAsync(workflowData as Omit<Workflow, 'id'>);
      toast.success(t('workflow.create.success'));
      navigate('/content/workflows');
    } catch (error) {
      toast.error(t('workflow.create.error'));
      console.error('Create workflow error:', error);
    }
  };

  const handleCancel = () => {
    navigate('/content/workflows');
  };

  return (
    <Page sidebar>
      <div className='bg-white sticky top-0 right-0 left-0 border-b border-slate-100 pb-4 z-10'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-x-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/content/workflows')}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
            <div>
              <h1 className='text-xl font-semibold text-slate-900'>{t('workflow.create.title')}</h1>
              <p className='text-sm text-slate-600'>{t('workflow.create.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollView className='bg-gray-50'>
        <Container className='max-w-6xl py-8'>
          <WorkflowDesigner onSave={handleSave} onCancel={handleCancel} />
        </Container>
      </ScrollView>
    </Page>
  );
};
