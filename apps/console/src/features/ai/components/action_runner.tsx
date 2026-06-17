import { useMemo, useState } from 'react';

import { Button, Icons, Modal, useToastMessage } from '@ncobase/react';
import { useNavigate } from 'react-router';

import type { AIActionDescriptor, AIActionResponse } from '../ai';
import { useAIActions, useAIStatus, useRunAIAction } from '../service';

import {
  AIInlineState,
  ResultPanel,
  actionResponseMeta,
  copyText,
  groupActionsByDomain
} from './shared';

interface AIActionRunnerProps {
  domain?: string;
  actionKeys?: string[];
  title?: string;
  buttonLabel?: string;
  buttonVariant?: string;
  content?: string;
  instruction?: string;
  context?: Record<string, any>;
  disabled?: boolean;
  compact?: boolean;
}

export const AIActionRunner = ({
  domain,
  actionKeys,
  title = 'AI assistant',
  buttonLabel = 'AI assist',
  buttonVariant = 'outline-slate',
  content = '',
  instruction = '',
  context = {},
  disabled = false,
  compact = false
}: AIActionRunnerProps) => {
  const navigate = useNavigate();
  const toast = useToastMessage();
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [draftContent, setDraftContent] = useState(content);
  const [draftInstruction, setDraftInstruction] = useState(instruction);
  const [contextText, setContextText] = useState(JSON.stringify(context || {}, null, 2));
  const [language, setLanguage] = useState('');
  const [tone, setTone] = useState('formal, precise, and production-ready');
  const [model, setModel] = useState('');
  const [result, setResult] = useState<AIActionResponse | null>(null);

  const statusQuery = useAIStatus();
  const actionsQuery = useAIActions();
  const runMutation = useRunAIAction();

  const actions = useMemo(() => {
    let values = actionsQuery.data || [];
    if (domain) {
      values = values.filter(action => action.domain === domain);
    }
    if (actionKeys?.length) {
      const allowed = new Set(actionKeys);
      values = values.filter(action => allowed.has(action.key));
    }
    return values;
  }, [actionKeys, actionsQuery.data, domain]);

  const selectedDescriptor = actions.find(action => action.key === selectedAction) || actions[0];
  const grouped = groupActionsByDomain(actions);
  const ready = !!statusQuery.data?.ready;

  const openDialog = () => {
    setDraftContent(content);
    setDraftInstruction(instruction);
    setContextText(JSON.stringify(context || {}, null, 2));
    setSelectedAction(selectedAction || actions[0]?.key || '');
    setResult(null);
    setOpen(true);
  };

  const runAction = async () => {
    const action = selectedAction || selectedDescriptor?.key;
    if (!action) return;

    let parsedContext: Record<string, any> = {};
    try {
      parsedContext = contextText.trim() ? JSON.parse(contextText) : {};
    } catch {
      toast.error('Invalid context JSON');
      return;
    }

    try {
      const response = await runMutation.mutateAsync({
        action,
        payload: {
          content: draftContent,
          instruction: draftInstruction,
          context: parsedContext,
          language,
          tone,
          model,
          output_format: selectedDescriptor?.output_type
        }
      });
      setResult(response);
      toast.success('AI action completed', { description: response.run_id });
    } catch (error: any) {
      toast.error('AI action failed', {
        description: error?.message || 'Unable to complete AI action'
      });
    }
  };

  return (
    <>
      <Button
        variant={buttonVariant as any}
        size={compact ? 'sm' : undefined}
        onClick={openDialog}
        disabled={disabled || statusQuery.isLoading}
      >
        <Icons name='IconSparkles' className='mr-1 h-4 w-4' />
        {buttonLabel}
      </Button>

      <Modal isOpen={open} onCancel={() => setOpen(false)} title={title} className='max-w-5xl'>
        <div className='space-y-5'>
          {statusQuery.isLoading ? (
            <AIInlineState type='loading' title='Checking AI runtime...' />
          ) : !ready ? (
            <AIInlineState
              type='disabled'
              title='AI runtime is not ready'
              description={
                statusQuery.data?.message || 'Enable and configure AI provider options first.'
              }
            />
          ) : null}

          {actionsQuery.isLoading ? (
            <AIInlineState type='loading' title='Loading AI actions...' />
          ) : actions.length === 0 ? (
            <AIInlineState
              type='empty'
              title='No actions are available'
              description='The current AI policy does not expose actions for this surface.'
            />
          ) : (
            <div className='grid grid-cols-1 gap-5 lg:grid-cols-[260px_minmax(0,1fr)]'>
              <div className='space-y-3'>
                {Object.entries(grouped).map(([group, items]) => (
                  <section key={group} className='rounded-lg border bg-white'>
                    <div className='border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>
                      {group}
                    </div>
                    <div className='p-2'>
                      {items.map((action: AIActionDescriptor) => (
                        <button
                          key={action.key}
                          type='button'
                          onClick={() => setSelectedAction(action.key)}
                          className={`mb-1 w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                            (selectedAction || selectedDescriptor?.key) === action.key
                              ? 'bg-blue-50 text-blue-800'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className='block font-medium'>{action.name}</span>
                          <span className='line-clamp-2 text-xs text-slate-500'>
                            {action.description}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <label className='space-y-1 text-sm'>
                    <span className='font-medium text-slate-700'>Language</span>
                    <input
                      value={language}
                      onChange={event => setLanguage(event.target.value)}
                      placeholder='Same as source'
                      className='w-full rounded-md border border-slate-200 px-3 py-2'
                    />
                  </label>
                  <label className='space-y-1 text-sm'>
                    <span className='font-medium text-slate-700'>Tone</span>
                    <input
                      value={tone}
                      onChange={event => setTone(event.target.value)}
                      className='w-full rounded-md border border-slate-200 px-3 py-2'
                    />
                  </label>
                  <label className='space-y-1 text-sm'>
                    <span className='font-medium text-slate-700'>Model override</span>
                    <input
                      value={model}
                      onChange={event => setModel(event.target.value)}
                      placeholder={statusQuery.data?.primary || 'provider/model'}
                      className='w-full rounded-md border border-slate-200 px-3 py-2'
                    />
                  </label>
                </div>

                <label className='block space-y-1 text-sm'>
                  <span className='font-medium text-slate-700'>Instruction</span>
                  <textarea
                    value={draftInstruction}
                    onChange={event => setDraftInstruction(event.target.value)}
                    rows={3}
                    className='w-full rounded-md border border-slate-200 px-3 py-2'
                  />
                </label>

                <label className='block space-y-1 text-sm'>
                  <span className='font-medium text-slate-700'>Content</span>
                  <textarea
                    value={draftContent}
                    onChange={event => setDraftContent(event.target.value)}
                    rows={8}
                    className='w-full rounded-md border border-slate-200 px-3 py-2'
                  />
                </label>

                <label className='block space-y-1 text-sm'>
                  <span className='font-medium text-slate-700'>Context JSON</span>
                  <textarea
                    value={contextText}
                    onChange={event => setContextText(event.target.value)}
                    rows={6}
                    className='w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs'
                  />
                </label>

                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <div className='text-xs text-slate-500'>
                    Output type: {selectedDescriptor?.output_type || '-'}
                  </div>
                  <div className='flex gap-2'>
                    {result?.run_id && (
                      <Button
                        variant='outline-slate'
                        size='sm'
                        onClick={() => navigate(`/ai/runs/${result.run_id}`)}
                      >
                        <Icons name='IconExternalLink' className='mr-1 h-4 w-4' />
                        Open run
                      </Button>
                    )}
                    <Button
                      size='sm'
                      onClick={runAction}
                      disabled={!ready || !selectedDescriptor || runMutation.isPending}
                      isLoading={runMutation.isPending}
                    >
                      <Icons name='IconPlayerPlay' className='mr-1 h-4 w-4' />
                      Run action
                    </Button>
                  </div>
                </div>

                {result && (
                  <ResultPanel
                    title={selectedDescriptor?.name || result.action}
                    content={result.content}
                    json={result.json}
                    runId={result.run_id}
                    meta={actionResponseMeta(result)}
                    onCopy={() =>
                      copyText(result.json ? JSON.stringify(result.json, null, 2) : result.content)
                    }
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
