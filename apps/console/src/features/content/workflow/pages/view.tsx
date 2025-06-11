import { Card, Button, Icons, Badge } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { useWorkflow } from '../service';
import { WorkflowStep } from '../workflow';

import { ErrorPage } from '@/components/errors';
import { Page } from '@/components/layout';

export const WorkflowViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: workflow, isLoading, error } = useWorkflow(id!);

  if (isLoading) {
    return (
      <Page sidebar>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <Icons name='IconLoader2' className='animate-spin mx-auto mb-4' size={40} />
            <p className='text-gray-600'>{t('common.loading')}</p>
          </div>
        </div>
      </Page>
    );
  }

  if (error || !workflow) {
    return (
      <Page sidebar>
        <ErrorPage statusCode={404} />
      </Page>
    );
  }

  const getStatusBadge = (status: number) => {
    return status === 0 ? (
      <Badge variant='success' className='flex items-center gap-1 px-3 py-1'>
        <Icons name='IconCheck' size={14} />
        {t('workflow.status.active')}
      </Badge>
    ) : (
      <Badge variant='secondary' className='flex items-center gap-1 px-3 py-1'>
        <Icons name='IconPause' size={14} />
        {t('workflow.status.inactive')}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      approval: 'primary',
      review: 'warning',
      publishing: 'success',
      custom: 'secondary'
    };
    return (
      <Badge variant={variants[type] || 'secondary'} className='capitalize px-3 py-1'>
        {t(`workflow.type.${type}`)}
      </Badge>
    );
  };

  const getStepTypeIcon = (stepType: string) => {
    switch (stepType) {
      case 'approval':
        return 'IconCheck';
      case 'review':
        return 'IconEye';
      case 'notification':
        return 'IconBell';
      case 'automation':
        return 'IconRobot';
      default:
        return 'IconCircle';
    }
  };

  return (
    <Page sidebar>
      <div className='px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='bg-white rounded-xl p-6 mb-8'>
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <div className='flex items-center gap-6'>
              <Button
                variant='text'
                className='hover:bg-gray-100 rounded-full p-2'
                onClick={() => navigate('/content/workflows')}
              >
                <Icons name='IconArrowLeft' size={20} />
              </Button>

              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg'>
                  <Icons name='IconGitBranch' size={32} className='text-white' />
                </div>
                <div>
                  <div className='flex items-center gap-3'>
                    <h1 className='text-2xl font-bold text-gray-900'>{workflow.name}</h1>
                    {getStatusBadge(workflow.status)}
                    {getTypeBadge(workflow.type)}
                  </div>
                  <p className='text-gray-500 mt-1'>
                    {workflow.description || t('workflow.no_description')}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <Button
                variant='outline'
                className='rounded-lg'
                onClick={() => navigate(`/content/workflows/${workflow.id}/edit`)}
              >
                <Icons name='IconEdit' size={18} className='mr-2' />
                {t('actions.edit')}
              </Button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Workflow Steps */}
            <Card className='overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h3 className='text-lg font-semibold'>{t('workflow.steps.title')}</h3>
              </div>
              <div className='p-6'>
                {workflow.steps && workflow.steps.length > 0 ? (
                  <div className='space-y-4'>
                    {workflow.steps
                      .sort((a, b) => a.order - b.order)
                      .map((step: WorkflowStep, index) => (
                        <div
                          key={step.id || index}
                          className='flex items-start space-x-4 p-4 border border-gray-200 rounded-lg'
                        >
                          <div className='flex-shrink-0'>
                            <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                              <Icons
                                name={getStepTypeIcon(step.step_type)}
                                size={20}
                                className='text-blue-600'
                              />
                            </div>
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center space-x-3 mb-2'>
                              <span className='bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded'>
                                {t('workflow.steps.step')} {step.order}
                              </span>
                              <h4 className='font-medium text-gray-900'>{step.name}</h4>
                              {step.required && (
                                <Badge variant='warning' className='text-xs'>
                                  {t('workflow.steps.required')}
                                </Badge>
                              )}
                            </div>
                            {step.description && (
                              <p className='text-sm text-gray-600 mb-2'>{step.description}</p>
                            )}
                            <div className='flex items-center space-x-4 text-xs text-gray-500'>
                              <span>
                                {t('workflow.steps.type')}:{' '}
                                {t(`workflow.step_type.${step.step_type}`)}
                              </span>
                              <span>
                                {t('workflow.steps.assignee')}:{' '}
                                {t(`workflow.assignee_type.${step.assignee_type}`)}
                              </span>
                              {step.due_days && (
                                <span>
                                  {t('workflow.steps.due_days')}: {step.due_days}
                                </span>
                              )}
                            </div>
                            {step.actions && step.actions.length > 0 && (
                              <div className='mt-3'>
                                <div className='flex flex-wrap gap-2'>
                                  {step.actions.map((action, actionIndex) => (
                                    <Badge
                                      key={actionIndex}
                                      variant='secondary'
                                      className='text-xs'
                                    >
                                      {action.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className='text-center py-8 text-gray-500'>
                    <Icons name='IconGitBranch' size={32} className='mx-auto mb-2' />
                    <p>{t('workflow.steps.empty')}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Content Types */}
            {workflow.content_types && workflow.content_types.length > 0 && (
              <Card className='overflow-hidden'>
                <div className='px-6 py-4 border-b border-gray-100'>
                  <h3 className='text-lg font-semibold'>{t('workflow.content_types.title')}</h3>
                </div>
                <div className='p-6'>
                  <div className='flex flex-wrap gap-2'>
                    {workflow.content_types.map((contentType, index) => (
                      <Badge key={index} variant='primary' className='px-3 py-1'>
                        {t(`content.type.${contentType}`)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className='space-y-8'>
            {/* Workflow Information */}
            <Card className='overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h3 className='text-lg font-semibold'>{t('workflow.information.title')}</h3>
              </div>
              <div className='p-6'>
                <div className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      {t('workflow.fields.id')}
                    </label>
                    <p className='mt-1 text-sm text-gray-900 font-mono'>{workflow.id}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      {t('workflow.fields.type')}
                    </label>
                    <div className='mt-1'>{getTypeBadge(workflow.type)}</div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      {t('workflow.fields.status')}
                    </label>
                    <div className='mt-1'>{getStatusBadge(workflow.status)}</div>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      {t('workflow.fields.steps_count')}
                    </label>
                    <p className='mt-1 text-sm text-gray-900'>
                      {workflow.steps?.length || 0} {t('workflow.steps.count')}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      {t('workflow.fields.created_at')}
                    </label>
                    <p className='mt-1 text-sm text-gray-900'>
                      {formatDateTime(workflow.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>
                      {t('workflow.fields.updated_at')}
                    </label>
                    <p className='mt-1 text-sm text-gray-900'>
                      {formatDateTime(workflow.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className='overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h3 className='text-lg font-semibold'>{t('workflow.actions.title')}</h3>
              </div>
              <div className='p-4'>
                <div className='space-y-3'>
                  <Button
                    variant='outline'
                    className='w-full justify-start'
                    onClick={() => navigate(`/content/workflows/${workflow.id}/edit`)}
                  >
                    <Icons name='IconEdit' size={16} className='mr-2' />
                    {t('workflow.actions.edit')}
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start'
                    onClick={() => {
                      // Copy workflow functionality
                      console.log('Copy workflow:', workflow.id);
                    }}
                  >
                    <Icons name='IconCopy' size={16} className='mr-2' />
                    {t('workflow.actions.duplicate')}
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start'
                    onClick={() => {
                      // Export workflow functionality
                      const dataStr = JSON.stringify(workflow, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `workflow-${workflow.name}-config.json`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Icons name='IconDownload' size={16} className='mr-2' />
                    {t('workflow.actions.export')}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
};
