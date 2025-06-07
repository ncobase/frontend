import React from 'react';

import { Badge, Icons } from '@ncobase/react';

import { WorkflowInstance } from '../workflow';

interface WorkflowStatusProps {
  instance?: WorkflowInstance;
  compact?: boolean;
}

export const WorkflowStatus: React.FC<WorkflowStatusProps> = ({ instance, compact = false }) => {
  if (!instance) {
    return (
      <Badge variant='secondary' className='flex items-center gap-1'>
        <Icons name='IconMinus' size={12} />
        No Workflow
      </Badge>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { variant: 'warning', icon: 'IconClock', label: 'Pending' };
      case 'in_progress':
        return { variant: 'primary', icon: 'IconProgress', label: 'In Progress' };
      case 'completed':
        return { variant: 'success', icon: 'IconCheck', label: 'Completed' };
      case 'rejected':
        return { variant: 'danger', icon: 'IconX', label: 'Rejected' };
      case 'cancelled':
        return { variant: 'secondary', icon: 'IconBan', label: 'Cancelled' };
      default:
        return { variant: 'secondary', icon: 'IconQuestionMark', label: 'Unknown' };
    }
  };

  const config = getStatusConfig(instance.status);

  if (compact) {
    return (
      <Badge variant={config.variant} className='flex items-center gap-1'>
        <Icons name={config.icon} size={12} />
        {config.label}
      </Badge>
    );
  }

  const currentStep = instance.steps?.find(step => step.status === 'in_progress');
  const completedSteps = instance.steps?.filter(step => step.status === 'completed')?.length || 0;
  const totalSteps = instance.steps?.length || 0;

  return (
    <div className='space-y-2'>
      <div className='flex items-center space-x-2'>
        <Badge variant={config.variant} className='flex items-center gap-1'>
          <Icons name={config.icon} size={12} />
          {config.label}
        </Badge>
        {totalSteps > 0 && (
          <span className='text-sm text-gray-500'>
            {completedSteps} of {totalSteps} steps completed
          </span>
        )}
      </div>

      {currentStep && (
        <div className='text-sm text-gray-600'>
          Current step: {currentStep.step_id}
          {currentStep.assignee_id && <span> • Assigned to: {currentStep.assignee_id}</span>}
        </div>
      )}

      {totalSteps > 0 && (
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-blue-600 h-2 rounded-full transition-all'
            style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};
