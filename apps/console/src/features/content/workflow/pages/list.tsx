import { useCallback } from 'react';

import { Button, Icons, Badge, TableView } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useNavigate } from 'react-router';

import { useWorkflows, useDeleteWorkflow } from '../service';
import { Workflow } from '../workflow';

import { Page } from '@/components/layout';

export const WorkflowListPage = () => {
  const navigate = useNavigate();
  const searchParams = { search: '', type: '', limit: 50 };

  const { data: workflowData, isLoading, refetch } = useWorkflows(searchParams);
  const deleteWorkflowMutation = useDeleteWorkflow();

  const workflows = workflowData?.items || [];

  const handleDelete = useCallback(
    async (workflow: Workflow) => {
      if (confirm('Are you sure you want to delete this workflow?')) {
        try {
          await deleteWorkflowMutation.mutateAsync(workflow.id!);
          refetch();
        } catch (error) {
          console.error('Failed to delete workflow:', error);
        }
      }
    },
    [deleteWorkflowMutation, refetch]
  );

  const getStatusBadge = (status: number) => {
    return status === 0 ? (
      <Badge variant='success'>Active</Badge>
    ) : (
      <Badge variant='secondary'>Inactive</Badge>
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
      <Badge variant={variants[type] || 'secondary'} className='capitalize'>
        {type}
      </Badge>
    );
  };

  const columns = [
    {
      title: 'Workflow Name',
      dataIndex: 'name',
      parser: (_: any, workflow: Workflow) => (
        <div>
          <div className='font-medium text-gray-900'>{workflow.name}</div>
          <div className='text-sm text-gray-500'>{workflow.description}</div>
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 120,
      parser: (type: string) => getTypeBadge(type)
    },
    {
      title: 'Steps',
      dataIndex: 'steps',
      width: 80,
      parser: (steps: any[]) => <span className='text-sm text-gray-600'>{steps?.length || 0}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      parser: (status: number) => getStatusBadge(status)
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      width: 120,
      parser: (created_at: string) => (
        <span className='text-sm text-gray-500'>{formatDateTime(created_at)}</span>
      )
    },
    {
      title: 'Actions',
      filter: false,
      parser: (_: any, workflow: Workflow) => (
        <div className='flex space-x-1'>
          <Button
            variant='text'
            size='xs'
            onClick={() => navigate(`/content/workflows/${workflow.id}`)}
          >
            <Icons name='IconEye' size={14} className='mr-1' />
            View
          </Button>
          <Button
            variant='text'
            size='xs'
            onClick={() => navigate(`/content/workflows/${workflow.id}/edit`)}
          >
            <Icons name='IconEdit' size={14} className='mr-1' />
            Edit
          </Button>
          <Button
            variant='text'
            size='xs'
            onClick={() => handleDelete(workflow)}
            className='text-red-600'
          >
            <Icons name='IconTrash' size={14} className='mr-1' />
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <Page sidebar title='Workflows'>
      <div className='space-y-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-semibold text-gray-900'>Workflows</h1>
            <p className='text-sm text-gray-600'>Manage content approval and review processes</p>
          </div>
          <Button size='sm' onClick={() => navigate('/content/workflows/create')}>
            <Icons name='IconPlus' size={16} className='mr-1' />
            Create Workflow
          </Button>
        </div>

        {/* Workflows List */}
        <div>
          {isLoading ? (
            <div className='flex items-center justify-center h-48'>
              <Icons name='IconLoader2' className='animate-spin' size={24} />
            </div>
          ) : workflows.length > 0 ? (
            <TableView header={columns} data={workflows} />
          ) : (
            <div className='text-center py-8'>
              <Icons name='IconGitBranch' size={32} className='mx-auto text-gray-400 mb-3' />
              <h3 className='text-base font-medium text-gray-900 mb-1'>No workflows found</h3>
              <p className='text-sm text-gray-500 mb-4'>
                Create your first workflow to manage content approval processes
              </p>
              <Button size='sm' onClick={() => navigate('/content/workflows/create')}>
                <Icons name='IconPlus' size={16} className='mr-1' />
                Create Workflow
              </Button>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};
