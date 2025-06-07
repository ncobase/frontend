import { Button, Container, Icons, ScrollView } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { WorkflowDesigner } from '../components/designer';
import { useWorkflow, useUpdateWorkflow } from '../service';
import { Workflow } from '../workflow';

import { Page } from '@/components/layout';

export const WorkflowEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const { data: workflow, isLoading } = useWorkflow(id!);
  const updateWorkflowMutation = useUpdateWorkflow();

  const handleSave = async (workflowData: Partial<Workflow>) => {
    try {
      await updateWorkflowMutation.mutateAsync({ ...workflowData, id } as Workflow);
      toast.success(t('workflow.update.success'));
      navigate(`/content/workflows/${id}`);
    } catch (error) {
      toast.error(t('workflow.update.error'));
      console.error('Update workflow error:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/content/workflows/${id}`);
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
              onClick={() => navigate(`/content/workflows/${id}`)}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
            <div>
              <h1 className='text-xl font-semibold text-slate-900'>{t('workflow.edit.title')}</h1>
              <p className='text-sm text-slate-600'>{t('workflow.edit.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <ScrollView className='bg-gray-50'>
        <Container className='max-w-6xl py-8'>
          <WorkflowDesigner workflow={workflow} onSave={handleSave} onCancel={handleCancel} />
        </Container>
      </ScrollView>
    </Page>
  );
};
