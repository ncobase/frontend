import { useMemo, useState } from 'react';

import { Button, Icons, useToastMessage } from '@ncobase/react';
import { useQueryClient } from '@tanstack/react-query';

import type {
  AICompleteResponse,
  AIRun,
  AIStreamChunkResponse,
  AIStreamStartResponse
} from '../ai';
import { streamAI } from '../apis';
import {
  AIInlineState,
  ResultPanel,
  actionResponseMeta,
  copyText,
  formatCount
} from '../components/shared';
import { aiKeys, useAIStatus, useCompleteAI } from '../service';

import { Page, Topbar } from '@/components/layout';

export const AIPlaygroundPage = () => {
  const toast = useToastMessage();
  const queryClient = useQueryClient();
  const statusQuery = useAIStatus();
  const completeMutation = useCompleteAI();
  const [mode, setMode] = useState<'complete' | 'stream'>('complete');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('');
  const [maxTokens, setMaxTokens] = useState(1024);
  const [temperature, setTemperature] = useState(0.2);
  const [jsonMode, setJsonMode] = useState(false);
  const [result, setResult] = useState<AICompleteResponse | null>(null);
  const [streamResult, setStreamResult] = useState<{
    runId?: string;
    operationId?: string;
    content: string;
    finalRun?: AIRun;
    finalChunk?: AIStreamChunkResponse;
  }>({ content: '' });
  const [streaming, setStreaming] = useState(false);

  const ready = !!statusQuery.data?.ready;
  const payload = useMemo(() => {
    const messages = systemPrompt.trim() ? [{ role: 'system', content: systemPrompt.trim() }] : [];
    return {
      prompt,
      messages,
      model,
      max_output_tokens: maxTokens,
      temperature,
      response_format: jsonMode ? { type: 'json_object' } : undefined,
      metadata: {
        source: 'console.ai.playground'
      }
    };
  }, [jsonMode, maxTokens, model, prompt, systemPrompt, temperature]);

  const runComplete = async () => {
    try {
      setResult(null);
      const response = await completeMutation.mutateAsync(payload);
      setResult(response);
      toast.success('AI completion finished', { description: response.run_id });
    } catch (error: any) {
      toast.error('AI completion failed', {
        description: error?.message || 'Unable to complete prompt'
      });
    }
  };

  const runStream = async () => {
    setStreaming(true);
    setStreamResult({ content: '' });
    try {
      await streamAI(payload, {
        onStart: (start: AIStreamStartResponse) => {
          setStreamResult(prev => ({
            ...prev,
            runId: start.run_id,
            operationId: start.operation_id
          }));
        },
        onChunk: chunk => {
          setStreamResult(prev => ({
            ...prev,
            content: `${prev.content}${chunk.content || ''}`,
            finalChunk: chunk.done ? chunk : prev.finalChunk
          }));
        },
        onRun: run => {
          setStreamResult(prev => ({ ...prev, finalRun: run }));
        },
        onError: error => {
          toast.error('AI stream failed', { description: error.error || 'Stream error' });
        }
      });
      queryClient.invalidateQueries({ queryKey: ['aiService', 'runs'] });
      queryClient.invalidateQueries({ queryKey: aiKeys.usage() });
      queryClient.invalidateQueries({ queryKey: aiKeys.status() });
    } catch (error: any) {
      toast.error('AI stream failed', { description: error?.message || 'Unable to stream prompt' });
    } finally {
      setStreaming(false);
    }
  };

  const run = () => (mode === 'stream' ? runStream() : runComplete());
  const activeContent = mode === 'stream' ? streamResult.content : result?.content || '';
  const activeRunId = mode === 'stream' ? streamResult.runId : result?.run_id;
  const resultMeta =
    mode === 'stream'
      ? [
          { label: 'Operation', value: streamResult.operationId },
          { label: 'Tokens', value: formatCount(streamResult.finalChunk?.total_tokens) },
          { label: 'Finish', value: streamResult.finalChunk?.finish_reason }
        ]
      : actionResponseMeta(result);

  return (
    <Page
      sidebar
      title='AI Playground'
      topbar={
        <Topbar
          title='AI Playground'
          right={[
            <Button
              key='run'
              size='sm'
              onClick={run}
              disabled={!ready || !prompt.trim() || completeMutation.isPending || streaming}
              isLoading={completeMutation.isPending || streaming}
            >
              <Icons
                name={mode === 'stream' ? 'IconActivity' : 'IconPlayerPlay'}
                className='mr-1 h-4 w-4'
              />
              {mode === 'stream' ? 'Stream' : 'Complete'}
            </Button>
          ]}
        />
      }
    >
      <div className='grid grid-cols-1 gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_420px]'>
        <div className='space-y-5'>
          {statusQuery.isLoading ? (
            <AIInlineState type='loading' title='Checking AI runtime...' />
          ) : !ready ? (
            <AIInlineState
              type='disabled'
              title='AI runtime is not ready'
              description={
                statusQuery.data?.message || 'Enable AI provider options before running prompts.'
              }
            />
          ) : null}

          <section className='rounded-lg border bg-white p-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
              <label className='space-y-1 text-sm'>
                <span className='font-medium text-slate-700'>Mode</span>
                <select
                  value={mode}
                  onChange={event => setMode(event.target.value as 'complete' | 'stream')}
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                >
                  <option value='complete'>Complete</option>
                  <option value='stream'>Stream</option>
                </select>
              </label>
              <label className='space-y-1 text-sm md:col-span-2'>
                <span className='font-medium text-slate-700'>Model override</span>
                <input
                  value={model}
                  onChange={event => setModel(event.target.value)}
                  placeholder={statusQuery.data?.primary || 'provider/model'}
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                />
              </label>
              <label className='flex items-center gap-2 pt-7 text-sm text-slate-700'>
                <input
                  type='checkbox'
                  checked={jsonMode}
                  onChange={event => setJsonMode(event.target.checked)}
                />
                JSON response
              </label>
              <label className='space-y-1 text-sm'>
                <span className='font-medium text-slate-700'>Max output tokens</span>
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
                <span className='font-medium text-slate-700'>System message</span>
                <textarea
                  value={systemPrompt}
                  onChange={event => setSystemPrompt(event.target.value)}
                  rows={4}
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                />
              </label>
              <label className='block space-y-1 text-sm'>
                <span className='font-medium text-slate-700'>Prompt</span>
                <textarea
                  value={prompt}
                  onChange={event => setPrompt(event.target.value)}
                  rows={14}
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                />
              </label>
              <div className='flex justify-end'>
                <Button
                  onClick={run}
                  disabled={!ready || !prompt.trim() || completeMutation.isPending || streaming}
                  isLoading={completeMutation.isPending || streaming}
                >
                  <Icons name='IconSend' className='mr-1 h-4 w-4' />
                  Run
                </Button>
              </div>
            </div>
          </section>
        </div>

        <div>
          <ResultPanel
            title='Output'
            content={activeContent}
            runId={activeRunId}
            meta={resultMeta}
            onCopy={() => copyText(activeContent)}
          />
        </div>
      </div>
    </Page>
  );
};
