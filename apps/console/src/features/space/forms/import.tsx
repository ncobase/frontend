import { useCallback, useState } from 'react';

import {
  Card,
  CardContent,
  Section,
  SelectField,
  UploaderField,
  Textarea,
  Button,
  Icons,
  Progress,
  Alert,
  Form
} from '@ncobase/react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

export const SpaceImportForm = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const formatType = watch('format');

  // Process and validate import data
  const processImportData = useCallback(
    data => {
      try {
        if (data.format === 'json' && data.jsonData) {
          const parsed = JSON.parse(data.jsonData);
          return Array.isArray(parsed) ? parsed : [parsed];
        } else if (data.format === 'file' && data.file) {
          // File processing would be handled by the parent component
          return [];
        }
        return [];
      } catch (error) {
        console.error('Error processing import data:', error);
        throw new Error(t('space.import.invalid_format'));
      }
    },
    [t]
  );

  // Preview imported data
  const handlePreview = useCallback(
    async data => {
      try {
        const processedData = processImportData(data);
        setPreviewData(processedData.slice(0, 5)); // Show first 5 items
        return processedData;
      } catch (error) {
        throw error;
      }
    },
    [processImportData]
  );

  // Simulate import progress
  const simulateImport = useCallback(
    async data => {
      setIsImporting(true);
      setImportProgress(0);

      const items = processImportData(data);
      const total = items.length;
      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      for (let i = 0; i < total; i++) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 100));

        // Simulate success/failure
        if (Math.random() > 0.1) {
          // 90% success rate
          success++;
        } else {
          failed++;
          errors.push(`Item ${i + 1}: ${t('space.import.validation_error')}`);
        }

        setImportProgress(((i + 1) / total) * 100);
      }

      setImportResult({ total, success, failed, errors });
      setIsImporting(false);
    },
    [processImportData, t]
  );

  const importFormSubmit = useCallback(
    handleSubmit(async data => {
      try {
        await simulateImport(data);
        if (onSubmit) {
          onSubmit(data);
        }
      } catch (error) {
        console.error('Import failed:', error);
      }
    }),
    [handleSubmit, simulateImport, onSubmit]
  );

  return (
    <Card>
      <CardContent className='p-0'>
        <Form
          id='space-import-form'
          className='space-y-6'
          onSubmit={importFormSubmit}
          control={control}
          errors={errors}
        >
          {/* Import Format Section */}
          <Section
            title={t('space.import.format_section', 'Import Format')}
            subtitle={t(
              'space.import.format_description',
              'Choose how you want to import space data'
            )}
            icon='IconFileUpload'
          >
            <div className='space-y-4'>
              <Controller
                name='format'
                control={control}
                defaultValue='file'
                rules={{ required: true }}
                render={({ field }) => (
                  <SelectField
                    label={t('space.import.format', 'Import Format')}
                    {...field}
                    options={[
                      {
                        label: t('space.import.file_format', 'File Upload (CSV, JSON, Excel)'),
                        value: 'file'
                      },
                      {
                        label: t('space.import.json_format', 'JSON Data'),
                        value: 'json'
                      }
                    ]}
                  />
                )}
              />

              {formatType === 'file' && (
                <Controller
                  name='file'
                  control={control}
                  render={({ field }) => (
                    <UploaderField
                      label={t('space.import.file', 'Upload File')}
                      {...field}
                      accept='.json,.csv,.xlsx,.xls'
                      maxSize={10 * 1024 * 1024} // 10MB
                      description={t(
                        'space.import.file_hint',
                        'Supported: CSV, JSON, Excel (max 10MB)'
                      )}
                    />
                  )}
                />
              )}

              {formatType === 'json' && (
                <Controller
                  name='jsonData'
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      label={t('space.import.json_data', 'JSON Data')}
                      {...field}
                      placeholder={t('space.import.json_placeholder', 'Paste your JSON data here')}
                      rows={8}
                      className='font-mono text-sm'
                    />
                  )}
                />
              )}
            </div>
          </Section>

          {/* Import Options */}
          <Section
            title={t('space.import.options_section', 'Import Options')}
            subtitle={t('space.import.options_description', 'Configure import behavior')}
            icon='IconSettings'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Controller
                name='conflictStrategy'
                control={control}
                defaultValue='skip'
                render={({ field }) => (
                  <SelectField
                    label={t('space.import.conflict_strategy', 'On Conflict')}
                    {...field}
                    options={[
                      { label: t('space.import.strategy_skip', 'Skip existing'), value: 'skip' },
                      {
                        label: t('space.import.strategy_update', 'Update existing'),
                        value: 'update'
                      },
                      {
                        label: t('space.import.strategy_replace', 'Replace existing'),
                        value: 'replace'
                      }
                    ]}
                  />
                )}
              />

              <Controller
                name='validateBeforeImport'
                control={control}
                defaultValue={true}
                render={({ field: { value, onChange } }) => (
                  <div className='flex items-center justify-between bg-slate-50/55 hover:bg-slate-50/25 px-3 py-1.5 border border-slate-200/65 rounded'>
                    <label className='font-medium'>
                      {t('space.import.validate', 'Validate Before Import')}
                    </label>
                    <input
                      type='checkbox'
                      checked={value}
                      onChange={e => onChange(e.target.checked)}
                      className='rounded border-slate-300'
                    />
                  </div>
                )}
              />
            </div>
          </Section>

          {/* Data Preview */}
          {previewData.length > 0 && (
            <Section
              title={t('space.import.preview_section', 'Data Preview')}
              subtitle={t('space.import.preview_description', 'Preview of data to be imported')}
              icon='IconEye'
            >
              <div className='space-y-3'>
                {previewData.map((item, index) => (
                  <div key={index} className='p-3 bg-slate-50 rounded border'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm'>
                      <div>
                        <strong>Name:</strong> {item.name || '-'}
                      </div>
                      <div>
                        <strong>Slug:</strong> {item.slug || '-'}
                      </div>
                      <div>
                        <strong>Type:</strong> {item.type || '-'}
                      </div>
                      <div>
                        <strong>URL:</strong> {item.url || '-'}
                      </div>
                    </div>
                  </div>
                ))}
                <div className='text-sm text-slate-500 text-center'>
                  {t('space.import.showing_preview', 'Showing first {{count}} items', {
                    count: previewData.length
                  })}
                </div>
              </div>
            </Section>
          )}

          {/* Import Progress */}
          {isImporting && (
            <Section
              title={t('space.import.progress_section', 'Import Progress')}
              icon='IconProgress'
            >
              <div className='space-y-3'>
                <Progress value={importProgress} className='h-3' />
                <div className='text-center text-sm'>
                  {t('space.import.processing', 'Processing... {{progress}}%', {
                    progress: Math.round(importProgress)
                  })}
                </div>
              </div>
            </Section>
          )}

          {/* Import Results */}
          {importResult && (
            <Section
              title={t('space.import.results_section', 'Import Results')}
              icon='IconCheckCircle'
            >
              <div className='space-y-4'>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='text-center p-3 bg-blue-50 rounded'>
                    <div className='text-2xl font-bold text-blue-600'>{importResult.total}</div>
                    <div className='text-sm text-blue-800'>{t('space.import.total_processed')}</div>
                  </div>
                  <div className='text-center p-3 bg-green-50 rounded'>
                    <div className='text-2xl font-bold text-green-600'>{importResult.success}</div>
                    <div className='text-sm text-green-800'>{t('space.import.successful')}</div>
                  </div>
                  <div className='text-center p-3 bg-red-50 rounded'>
                    <div className='text-2xl font-bold text-red-600'>{importResult.failed}</div>
                    <div className='text-sm text-red-800'>{t('space.import.failed')}</div>
                  </div>
                </div>

                {importResult.errors.length > 0 && (
                  <Alert variant='warning'>
                    <div className='space-y-2'>
                      <div className='font-medium'>{t('space.import.errors_found')}</div>
                      <ul className='text-sm list-disc list-inside space-y-1'>
                        {importResult.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {importResult.errors.length > 5 && (
                          <li>
                            {t('space.import.more_errors', 'And {{count}} more...', {
                              count: importResult.errors.length - 5
                            })}
                          </li>
                        )}
                      </ul>
                    </div>
                  </Alert>
                )}
              </div>
            </Section>
          )}

          {/* Action Buttons */}
          <div className='flex justify-end space-x-3 pt-4 border-t border-slate-200/60'>
            <Button type='button' variant='outline' onClick={onCancel}>
              {t('actions.cancel', 'Cancel')}
            </Button>
            {!importResult && (
              <Button type='submit' disabled={isImporting}>
                <Icons name='IconUpload' className='mr-2' />
                {isImporting
                  ? t('space.import.importing')
                  : t('space.import.submit', 'Import Spaces')}
              </Button>
            )}
            {importResult && <Button onClick={onCancel}>{t('actions.close', 'Close')}</Button>}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};
