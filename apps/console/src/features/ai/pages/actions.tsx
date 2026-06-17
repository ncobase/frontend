import { useMemo, useState } from 'react';

import { Button, Icons, useToastMessage } from '@ncobase/react';
import { useNavigate } from 'react-router';

import type { AIActionDescriptor, AIActionResponse } from '../ai';
import {
  AIInlineState,
  ResultPanel,
  actionResponseMeta,
  copyText,
  groupActionsByDomain
} from '../components/shared';
import { useAIActions, useAIStatus, useRunAIAction } from '../service';

import { Page, Topbar } from '@/components/layout';

export const AIActionsPage = () => {
  const navigate = useNavigate();
  const toast = useToastMessage();
  const statusQuery = useAIStatus();
  const actionsQuery = useAIActions();
  const runMutation = useRunAIAction();
  const [domain, setDomain] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [content, setContent] = useState('');
  const [instruction, setInstruction] = useState('');
  const [contextText, setContextText] = useState('{}');
  const [language, setLanguage] = useState('');
  const [tone, setTone] = useState('formal, precise, and production-ready');
  const [model, setModel] = useState('');
  const [maxTokens, setMaxTokens] = useState(1024);
  const [temperature, setTemperature] = useState(0.2);
  const [result, setResult] = useState<AIActionResponse | null>(null);

  const actions = actionsQuery.data || [];
  const domains = useMemo(
    () => Array.from(new Set(actions.map(action => action.domain))).sort(),
    [actions]
  );
  const filteredActions = useMemo(
    () => (domain ? actions.filter(action => action.domain === domain) : actions),
    [actions, domain]
  );
  const grouped = groupActionsByDomain(filteredActions);
  const selectedDescriptor: AIActionDescriptor | undefined =
    filteredActions.find(action => action.key === selectedAction) || filteredActions[0];
  const ready = !!statusQuery.data?.ready;

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
          content,
          instruction,
          context: parsedContext,
          language,
          tone,
          model,
          max_output_tokens: maxTokens,
          temperature,
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
    <Page
      sidebar
      title='AI Actions'
      topbar={
        <Topbar
          title='AI Actions'
          right={[
            <Button
              key='run'
              size='sm'
              onClick={runAction}
              disabled={!ready || !selectedDescriptor || runMutation.isPending}
              isLoading={runMutation.isPending}
            >
              <Icons name='IconPlayerPlay' className='mr-1 h-4 w-4' />
              Run action
            </Button>
          ]}
        />
      }
    >
      <div className='grid grid-cols-1 gap-6 p-6 xl:grid-cols-[300px_minmax(0,1fr)_420px]'>
        <aside className='space-y-4'>
          <section className='rounded-lg border bg-white p-4'>
            <label className='block space-y-1 text-sm'>
              <span className='font-medium text-slate-700'>Domain</span>
              <select
                value={domain}
                onChange={event => {
                  setDomain(event.target.value);
                  setSelectedAction('');
                }}
                className='w-full rounded-md border border-slate-200 px-3 py-2'
              >
                <option value=''>All domains</option>
                {domains.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </section>

          {actionsQuery.isLoading ? (
            <AIInlineState type='loading' title='Loading actions...' />
          ) : Object.keys(grouped).length === 0 ? (
            <AIInlineState type='empty' title='No actions are enabled by policy' />
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <section key={group} className='rounded-lg border bg-white'>
                <div className='border-b px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>
                  {group}
                </div>
                <div className='p-2'>
                  {items.map(action => (
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
            ))
          )}
        </aside>

        <main className='space-y-5'>
          {statusQuery.isLoading ? (
            <AIInlineState type='loading' title='Checking AI runtime...' />
          ) : !ready ? (
            <AIInlineState
              type='disabled'
              title='AI runtime is not ready'
              description={
                statusQuery.data?.message || 'Enable AI provider options before running actions.'
              }
            />
          ) : null}

          <section className='rounded-lg border bg-white p-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
              <label className='space-y-1 text-sm'>
                <span className='font-medium text-slate-700'>Language</span>
                <input
                  value={language}
                  onChange={event => setLanguage(event.target.value)}
                  placeholder='Same as source'
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                />
              </label>
              <label className='space-y-1 text-sm md:col-span-2'>
                <span className='font-medium text-slate-700'>Tone</span>
                <input
                  value={tone}
                  onChange={event => setTone(event.target.value)}
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                />
              </label>
              <label className='space-y-1 text-sm'>
                <span className='font-medium text-slate-700'>Model</span>
                <input
                  value={model}
                  onChange={event => setModel(event.target.value)}
                  placeholder={statusQuery.data?.primary || 'provider/model'}
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                />
              </label>
              <label className='space-y-1 text-sm'>
                <span className='font-medium text-slate-700'>Max tokens</span>
                <input
                  type='number'
                  min={1}
                  max={statusQuery.data?.policy?.max_output_tokens || 4096}
                  value={maxTokens}
                  onChange={event => setMaxTokens(Number(event.target.value))}
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                />
              </label>
              <label className='space-y-1 text-sm'>
                <span className='font-medium text-slate-700'>Temperature</span>
                <input
                  type='number'
                  min={0}
                  max={2}
                  step={0.1}
                  value={temperature}
                  onChange={event => setTemperature(Number(event.target.value))}
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                />
              </label>
            </div>
          </section>

          <section className='rounded-lg border bg-white p-4'>
            <div className='space-y-4'>
              <label className='block space-y-1 text-sm'>
                <span className='font-medium text-slate-700'>Instruction</span>
                <textarea
                  value={instruction}
                  onChange={event => setInstruction(event.target.value)}
                  rows={3}
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                />
              </label>
              <label className='block space-y-1 text-sm'>
                <span className='font-medium text-slate-700'>Content</span>
                <textarea
                  value={content}
                  onChange={event => setContent(event.target.value)}
                  rows={12}
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                />
              </label>
              <label className='block space-y-1 text-sm'>
                <span className='font-medium text-slate-700'>Context JSON</span>
                <textarea
                  value={contextText}
                  onChange={event => setContextText(event.target.value)}
                  rows={8}
                  className='w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-xs'
                />
              </label>
              <div className='flex justify-end'>
                <Button
                  onClick={runAction}
                  disabled={!ready || !selectedDescriptor || runMutation.isPending}
                  isLoading={runMutation.isPending}
                >
                  <Icons name='IconPlayerPlay' className='mr-1 h-4 w-4' />
                  Run action
                </Button>
              </div>
            </div>
          </section>
        </main>

        <aside>
          <ResultPanel
            title={selectedDescriptor?.name || 'Result'}
            content={result?.content}
            json={result?.json}
            runId={result?.run_id}
            meta={actionResponseMeta(result)}
            onCopy={() =>
              copyText(result?.json ? JSON.stringify(result.json, null, 2) : result?.content || '')
            }
          />
          {result?.run_id && (
            <div className='mt-3 flex justify-end'>
              <Button
                variant='outline-slate'
                size='sm'
                onClick={() => navigate(`/ai/runs/${result.run_id}`)}
              >
                <Icons name='IconExternalLink' className='mr-1 h-4 w-4' />
                Open run
              </Button>
            </div>
          )}
        </aside>
      </div>
    </Page>
  );
};
