import React, { useState, useCallback } from 'react';

import { Button, Icons, Card } from '@ncobase/react';

import { Workflow, WorkflowStep } from '../workflow';

interface WorkflowDesignerProps {
  workflow?: Workflow;
  onSave: (_workflow: Partial<Workflow>) => void;
  onCancel: () => void;
}

export const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({
  workflow,
  onSave,
  onCancel
}) => {
  const [currentWorkflow, setCurrentWorkflow] = useState<Partial<Workflow>>(
    workflow || {
      name: '',
      description: '',
      type: 'approval',
      status: 0,
      steps: [],
      content_types: []
    }
  );

  const addStep = useCallback(() => {
    const newStep: WorkflowStep = {
      name: `Step ${(currentWorkflow.steps?.length || 0) + 1}`,
      description: '',
      step_type: 'approval',
      order: (currentWorkflow.steps?.length || 0) + 1,
      required: true,
      assignee_type: 'user',
      actions: [
        { name: 'Approve', action_type: 'approve' },
        { name: 'Reject', action_type: 'reject' }
      ]
    };

    setCurrentWorkflow(prev => ({
      ...prev,
      steps: [...(prev.steps || []), newStep]
    }));
  }, [currentWorkflow.steps]);

  const updateStep = useCallback((index: number, step: Partial<WorkflowStep>) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: prev.steps?.map((s, i) => (i === index ? { ...s, ...step } : s)) || []
    }));
  }, []);

  const removeStep = useCallback((index: number) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: prev.steps?.filter((_, i) => i !== index) || []
    }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(currentWorkflow);
  }, [currentWorkflow, onSave]);

  return (
    <div className='space-y-6'>
      {/* Workflow Basic Info */}
      <Card className='p-6'>
        <h3 className='text-lg font-medium mb-4'>Workflow Configuration</h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Workflow Name</label>
            <input
              type='text'
              value={currentWorkflow.name}
              onChange={e => setCurrentWorkflow(prev => ({ ...prev, name: e.target.value }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              placeholder='Enter workflow name'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Workflow Type</label>
            <select
              value={currentWorkflow.type}
              onChange={e =>
                setCurrentWorkflow(prev => ({
                  ...prev,
                  type: e.target.value as 'approval' | 'review' | 'publishing' | 'custom'
                }))
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
            >
              <option value='approval'>Approval</option>
              <option value='review'>Review</option>
              <option value='publishing'>Publishing</option>
              <option value='custom'>Custom</option>
            </select>
          </div>
          <div className='col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
            <textarea
              value={currentWorkflow.description}
              onChange={e => setCurrentWorkflow(prev => ({ ...prev, description: e.target.value }))}
              className='w-full px-3 py-2 border border-gray-300 rounded-md'
              rows={3}
              placeholder='Enter workflow description'
            />
          </div>
        </div>
      </Card>

      {/* Workflow Steps */}
      <Card className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-medium'>Workflow Steps</h3>
          <Button onClick={addStep} size='sm'>
            <Icons name='IconPlus' size={16} className='mr-1' />
            Add Step
          </Button>
        </div>

        <div className='space-y-4'>
          {currentWorkflow.steps?.map((step, index) => (
            <div key={index} className='border border-gray-200 rounded-lg p-4'>
              <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center space-x-2'>
                  <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded'>
                    Step {step.order}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => removeStep(index)}
                  className='text-red-600'
                >
                  <Icons name='IconTrash' size={16} />
                </Button>
              </div>

              <div className='grid grid-cols-3 gap-3'>
                <div>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>Step Name</label>
                  <input
                    type='text'
                    value={step.name}
                    onChange={e => updateStep(index, { name: e.target.value })}
                    className='w-full px-2 py-1 text-sm border border-gray-300 rounded'
                  />
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>Step Type</label>
                  <select
                    value={step.step_type}
                    onChange={e =>
                      updateStep(index, {
                        step_type: e.target.value as
                          | 'approval'
                          | 'review'
                          | 'notification'
                          | 'automation'
                      })
                    }
                    className='w-full px-2 py-1 text-sm border border-gray-300 rounded'
                  >
                    <option value='approval'>Approval</option>
                    <option value='review'>Review</option>
                    <option value='notification'>Notification</option>
                    <option value='automation'>Automation</option>
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-medium text-gray-700 mb-1'>
                    Assignee Type
                  </label>
                  <select
                    value={step.assignee_type}
                    onChange={e =>
                      updateStep(index, {
                        assignee_type: e.target.value as 'user' | 'role' | 'group'
                      })
                    }
                    className='w-full px-2 py-1 text-sm border border-gray-300 rounded'
                  >
                    <option value='user'>User</option>
                    <option value='role'>Role</option>
                    <option value='group'>Group</option>
                  </select>
                </div>
              </div>

              <div className='mt-3'>
                <label className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={step.required}
                    onChange={e => updateStep(index, { required: e.target.checked })}
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded'
                  />
                  <span className='text-sm text-gray-700'>Required Step</span>
                </label>
              </div>
            </div>
          ))}

          {(!currentWorkflow.steps || currentWorkflow.steps.length === 0) && (
            <div className='text-center py-8 text-gray-500'>
              <Icons name='IconGitBranch' size={32} className='mx-auto mb-2' />
              <p>No workflow steps defined</p>
              <p className='text-sm'>Add steps to create your workflow</p>
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <div className='flex justify-end space-x-3'>
        <Button variant='outline' onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Workflow</Button>
      </div>
    </div>
  );
};
