import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Badge,
  Button,
  Icons,
  Input,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  useToastMessage
} from '@ncobase/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { batchGetByNames, createOption, updateOption } from '../apis';
import { Option } from '../option';
import {
  buildRuntimeDrafts,
  buildRuntimeOptionPayload,
  normalizeRuntimeValue,
  RUNTIME_GROUPS,
  RUNTIME_OPTION_DEFINITION_BY_NAME,
  RUNTIME_OPTION_DEFINITIONS,
  RUNTIME_OPTION_NAMES,
  RuntimeDraftMap,
  RuntimeErrorMap,
  RuntimeFieldDefinition,
  RuntimeOptionDefinition,
  RuntimeOptionName,
  RuntimeOptionValue,
  validateRuntimeOption
} from '../runtime/options';
import { optionKeys } from '../service';

import { Button as ToolbarButton } from '@/components/elements';
import { Page, Topbar } from '@/components/layout';

const emptyDrafts = buildRuntimeDrafts({});

const formatBytes = (value: RuntimeOptionValue[string]) => {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return '';

  const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size % 1 === 0 ? size.toFixed(0) : size.toFixed(2)} ${units[unitIndex]}`;
};

const fieldHint = (definition: RuntimeOptionDefinition, field: RuntimeFieldDefinition) => {
  if (field.kind === 'duration') {
    return 'Duration format: seconds, 30m, 2h, 7d, or 1w';
  }

  if (definition.name === 'resource.quota' && field.key === 'warning_threshold') {
    return 'Use a fraction between 0 and 1';
  }

  if (field.kind === 'stringList') {
    return 'Separate values with commas or new lines';
  }

  return '';
};

const optionStateBadge = (definition: RuntimeOptionDefinition, drafts: RuntimeDraftMap) => {
  const draft = drafts[definition.name];
  if (!draft?.exists) {
    return <Badge variant='outline-warning'>Missing</Badge>;
  }
  if (draft.parseError) {
    return <Badge variant='outline-danger'>Invalid JSON</Badge>;
  }
  return <Badge variant='outline-success'>Active</Badge>;
};

export const RuntimeSettingsPage = () => {
  const navigate = useNavigate();
  const toast = useToastMessage();
  const queryClient = useQueryClient();

  const [activeGroup, setActiveGroup] = useState<(typeof RUNTIME_GROUPS)[number]['key']>('access');
  const [drafts, setDrafts] = useState<RuntimeDraftMap>(emptyDrafts);
  const [dirty, setDirty] = useState<Partial<Record<RuntimeOptionName, boolean>>>({});
  const [errors, setErrors] = useState<RuntimeErrorMap>({});
  const [savingNames, setSavingNames] = useState<RuntimeOptionName[]>([]);

  const runtimeOptionQuery = useQuery({
    queryKey: optionKeys.batch([...RUNTIME_OPTION_NAMES]),
    queryFn: async () =>
      (await batchGetByNames([...RUNTIME_OPTION_NAMES])) as Partial<
        Record<RuntimeOptionName, Option>
      >,
    staleTime: 30 * 1000
  });

  useEffect(() => {
    if (!runtimeOptionQuery.data) return;

    const nextDrafts = buildRuntimeDrafts(runtimeOptionQuery.data);
    const nextErrors: RuntimeErrorMap = {};

    RUNTIME_OPTION_DEFINITIONS.forEach(definition => {
      const draft = nextDrafts[definition.name];
      if (draft.parseError) {
        nextErrors[definition.name] = [`Stored value is invalid JSON: ${draft.parseError}`];
      }
    });

    setDrafts(nextDrafts);
    setDirty({});
    setErrors(nextErrors);
  }, [runtimeOptionQuery.data]);

  const missingCount = useMemo(
    () => RUNTIME_OPTION_DEFINITIONS.filter(definition => !drafts[definition.name]?.exists).length,
    [drafts]
  );

  const dirtyNames = useMemo(
    () =>
      RUNTIME_OPTION_NAMES.filter(name => {
        const draft = drafts[name];
        return dirty[name] || !draft?.exists || !!draft?.parseError;
      }),
    [dirty, drafts]
  );

  const setFieldValue = useCallback(
    (name: RuntimeOptionName, field: RuntimeFieldDefinition, value: RuntimeOptionValue[string]) => {
      setDrafts(prev => {
        const currentDraft = prev[name];
        const nextDraft = {
          ...currentDraft,
          value: {
            ...currentDraft.value,
            [field.key]: value
          }
        };

        return {
          ...prev,
          [name]: nextDraft
        };
      });
      setDirty(prev => ({ ...prev, [name]: true }));
      setErrors(prev => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const resetOption = useCallback(
    (definition: RuntimeOptionDefinition) => {
      const option = runtimeOptionQuery.data?.[definition.name];
      const nextDraft = buildRuntimeDrafts({
        [definition.name]: option
      } as Partial<Record<RuntimeOptionName, Option>>)[definition.name];

      setDrafts(prev => ({ ...prev, [definition.name]: nextDraft }));
      setDirty(prev => ({ ...prev, [definition.name]: false }));
      setErrors(prev => ({ ...prev, [definition.name]: undefined }));
    },
    [runtimeOptionQuery.data]
  );

  const resetAll = useCallback(() => {
    setDrafts(buildRuntimeDrafts(runtimeOptionQuery.data || {}));
    setDirty({});
    setErrors({});
  }, [runtimeOptionQuery.data]);

  const persistOption = useCallback(
    async (name: RuntimeOptionName) => {
      const definition = RUNTIME_OPTION_DEFINITION_BY_NAME[name];
      const draft = drafts[name];
      const optionErrors = validateRuntimeOption(definition, draft.value);

      if (optionErrors.length > 0) {
        setErrors(prev => ({ ...prev, [name]: optionErrors }));
        throw new Error(optionErrors[0]);
      }

      const payload = buildRuntimeOptionPayload(definition, draft);
      if (payload.id) {
        return updateOption(payload);
      }

      const { id: _id, ...createPayload } = payload;
      return createOption(createPayload);
    },
    [drafts]
  );

  const saveOptions = useCallback(
    async (names: RuntimeOptionName[]) => {
      if (names.length === 0) return;

      const nextErrors: RuntimeErrorMap = {};
      names.forEach(name => {
        const definition = RUNTIME_OPTION_DEFINITION_BY_NAME[name];
        const optionErrors = validateRuntimeOption(definition, drafts[name].value);
        if (optionErrors.length > 0) {
          nextErrors[name] = optionErrors;
        }
      });

      if (Object.keys(nextErrors).length > 0) {
        setErrors(prev => ({ ...prev, ...nextErrors }));
        toast.error('Validation failed', {
          description: 'Fix the highlighted runtime option fields before saving.'
        });
        return;
      }

      setSavingNames(names);
      try {
        for (const name of names) {
          await persistOption(name);
        }

        await queryClient.invalidateQueries({ queryKey: ['optionService'] });
        await runtimeOptionQuery.refetch();
        toast.success('Runtime settings saved', {
          description: `${names.length} option${names.length === 1 ? '' : 's'} updated.`
        });
      } catch (error) {
        toast.error('Failed to save runtime settings', {
          description: error['message'] || 'The option update request failed.'
        });
      } finally {
        setSavingNames([]);
      }
    },
    [drafts, persistOption, queryClient, runtimeOptionQuery, toast]
  );

  const renderField = (definition: RuntimeOptionDefinition, field: RuntimeFieldDefinition) => {
    const draft = drafts[definition.name];
    const value = draft.value[field.key];
    const disabled = !!field.disabledWhen?.(draft.value) || savingNames.length > 0;
    const hint = fieldHint(definition, field);

    const label = (
      <div className='flex items-center justify-between gap-3'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-200'>
          {field.label}
        </label>
        {(field.key.includes('size') || field.key.includes('quota')) && (
          <span className='text-xs text-slate-500 dark:text-slate-400'>{formatBytes(value)}</span>
        )}
      </div>
    );

    if (field.kind === 'boolean') {
      return (
        <div
          key={field.key}
          className='flex min-h-10 items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900'
        >
          <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>
            {field.label}
          </span>
          <Switch
            checked={value === true}
            disabled={disabled}
            onCheckedChange={checked => setFieldValue(definition.name, field, checked)}
          />
        </div>
      );
    }

    if (field.kind === 'select') {
      return (
        <div key={field.key} className='space-y-1.5'>
          {label}
          <select
            value={String(value ?? '')}
            disabled={disabled}
            onChange={event => setFieldValue(definition.name, field, event.target.value)}
            className='h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-colors hover:bg-slate-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
          >
            {(field.options || []).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.kind === 'stringList') {
      return (
        <div key={field.key} className='space-y-1.5 md:col-span-2'>
          {label}
          <Textarea
            value={Array.isArray(value) ? value.join('\n') : String(value || '')}
            disabled={disabled}
            placeholder={field.placeholder}
            rows={4}
            onChange={event => setFieldValue(definition.name, field, event.target.value)}
          />
          {hint && <p className='text-xs text-slate-500 dark:text-slate-400'>{hint}</p>}
        </div>
      );
    }

    return (
      <div key={field.key} className='space-y-1.5'>
        {label}
        <Input
          type={field.kind === 'number' ? 'number' : 'text'}
          value={String(value ?? '')}
          disabled={disabled}
          min={field.min}
          max={field.max}
          step={field.step}
          inputMode={field.inputMode}
          placeholder={field.placeholder}
          onChange={event => {
            const nextValue =
              field.kind === 'number' && event.target.value !== ''
                ? Number(event.target.value)
                : event.target.value;
            setFieldValue(definition.name, field, nextValue);
          }}
        />
        {hint && <p className='text-xs text-slate-500 dark:text-slate-400'>{hint}</p>}
      </div>
    );
  };

  const renderOptionPanel = (definition: RuntimeOptionDefinition) => {
    const draft = drafts[definition.name];
    const optionErrors = errors[definition.name] || [];
    const isSaving = savingNames.includes(definition.name);
    const normalizedValue = normalizeRuntimeValue(definition, draft.value);
    const hasChanges = dirty[definition.name] || !draft.exists || !!draft.parseError;

    return (
      <section
        key={definition.name}
        className='rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
      >
        <div className='flex flex-col gap-4 border-b border-slate-100 px-4 py-3 dark:border-slate-800 md:flex-row md:items-start md:justify-between'>
          <div className='flex min-w-0 gap-3'>
            <span className='mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
              <Icons name={definition.icon} />
            </span>
            <div className='min-w-0'>
              <div className='flex flex-wrap items-center gap-2'>
                <h2 className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
                  {definition.title}
                </h2>
                <code className='rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                  {definition.name}
                </code>
                {optionStateBadge(definition, drafts)}
                {dirty[definition.name] && <Badge variant='outline-blue'>Changed</Badge>}
              </div>
              <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                {definition.description}
              </p>
            </div>
          </div>

          <div className='flex shrink-0 items-center gap-2'>
            <Button
              variant='outline-slate'
              size='sm'
              disabled={!hasChanges || isSaving}
              onClick={() => resetOption(definition)}
            >
              Reset
            </Button>
            <Button
              size='sm'
              disabled={!hasChanges || savingNames.length > 0}
              isLoading={isSaving}
              onClick={() => saveOptions([definition.name])}
            >
              {draft.exists ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-5 px-4 py-4 lg:grid-cols-[minmax(0,1fr)_18rem]'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {definition.fields.map(field => renderField(definition, field))}
          </div>

          <aside className='space-y-4 border-t border-slate-100 pt-4 dark:border-slate-800 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0'>
            <div>
              <div className='text-xs font-medium uppercase text-slate-400'>Runtime impact</div>
              <ul className='mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-300'>
                {definition.impact.map(item => (
                  <li key={item} className='flex gap-2'>
                    <Icons name='IconPointFilled' className='mt-1 h-3 w-3 text-slate-400' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className='text-xs font-medium uppercase text-slate-400'>Saved JSON</div>
              <pre className='mt-2 max-h-52 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100'>
                {JSON.stringify(normalizedValue, null, 2)}
              </pre>
            </div>
          </aside>
        </div>

        {optionErrors.length > 0 && (
          <div className='border-t border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300'>
            <div className='flex items-start gap-2'>
              <Icons name='IconAlertTriangle' className='mt-0.5 h-4 w-4 shrink-0' />
              <div className='space-y-1'>
                {optionErrors.map(error => (
                  <div key={error}>{error}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    );
  };

  return (
    <Page
      sidebar
      title='Runtime Settings'
      topbar={
        <Topbar
          title='Runtime Settings'
          left={[
            <ToolbarButton
              key='back'
              icon='IconArrowLeft'
              tooltip='Back to option list'
              onClick={() => navigate('/system/options')}
            />,
            <ToolbarButton
              key='refresh'
              icon='IconRefresh'
              tooltip='Refresh runtime settings'
              onClick={() => runtimeOptionQuery.refetch()}
            />
          ]}
          right={[
            <Button
              key='reset'
              variant='outline-slate'
              size='sm'
              disabled={dirtyNames.length === 0 || savingNames.length > 0}
              onClick={resetAll}
            >
              Reset all
            </Button>,
            <Button
              key='save'
              size='sm'
              disabled={dirtyNames.length === 0 || savingNames.length > 0}
              isLoading={savingNames.length > 1}
              onClick={() => saveOptions(dirtyNames)}
            >
              Save all
            </Button>
          ]}
        />
      }
    >
      <div className='space-y-4'>
        <div className='rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900'>
          <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div>
              <div className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
                Runtime options backed by /sys/options
              </div>
              <div className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                Product policy is edited here; infrastructure and secrets stay in config.yaml.
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='outline-slate'>{RUNTIME_OPTION_NAMES.length} managed options</Badge>
              {missingCount > 0 && <Badge variant='outline-warning'>{missingCount} missing</Badge>}
              {dirtyNames.length > 0 && (
                <Badge variant='outline-blue'>{dirtyNames.length} pending</Badge>
              )}
            </div>
          </div>
        </div>

        {runtimeOptionQuery.isError && (
          <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300'>
            Failed to load runtime options: {runtimeOptionQuery.error['message']}
          </div>
        )}

        <Tabs
          value={activeGroup}
          onValueChange={value => setActiveGroup(value as typeof activeGroup)}
        >
          <TabsList className='w-full justify-start gap-1 overflow-x-auto border-b border-slate-200 bg-white px-2 dark:border-slate-700 dark:bg-slate-900'>
            {RUNTIME_GROUPS.map(group => (
              <TabsTrigger
                key={group.key}
                value={group.key}
                className='gap-2 text-sm data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-300'
              >
                <Icons name={group.icon} className='h-4 w-4' />
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {RUNTIME_GROUPS.map(group => (
            <TabsContent key={group.key} value={group.key} className='mt-4 space-y-4'>
              {runtimeOptionQuery.isLoading ? (
                <div className='flex min-h-52 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'>
                  <Icons name='IconLoader2' className='mr-2 h-5 w-5 animate-spin' />
                  Loading runtime settings...
                </div>
              ) : (
                RUNTIME_OPTION_DEFINITIONS.filter(definition => definition.group === group.key).map(
                  renderOptionPanel
                )
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Page>
  );
};

export default RuntimeSettingsPage;
