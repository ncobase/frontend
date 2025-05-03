import { useCallback } from 'react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Section,
  SelectField,
  UploaderField,
  Textarea,
  Button,
  Icons
} from '@ncobase/react';
import { useForm, Form, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Tenant } from '../tenant';

export const TenantImportForm = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Process import data from file or JSON
  const processImportData = data => {
    try {
      if (data.format === 'json' && data.jsonData) {
        // Parse JSON data directly
        return JSON.parse(data.jsonData);
      } else if (data.format === 'file' && data.file) {
        return [];
      }
      return [];
    } catch (error) {
      console.error('Error processing import data:', error);
      return [];
    }
  };

  const importFormSubmit = useCallback(
    handleSubmit((data: Tenant) => {
      const importData = processImportData(data);
      onSubmit(importData);
    }),
    [onSubmit, handleSubmit]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tenant.import.title', 'Import Tenants')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          id='tenant-import-form'
          className='space-y-4'
          // @ts-expect-error
          onSubmit={importFormSubmit}
          control={control}
          errors={errors}
        >
          <Section
            title={t('tenant.import.format_section', 'Import Format')}
            subtitle={t(
              'tenant.import.format_description',
              'Choose how you want to import tenant data'
            )}
            icon='IconUpload'
          >
            <div className='space-y-4'>
              <Controller
                name='format'
                control={control}
                defaultValue='file'
                rules={{ required: true }}
                render={({ field }) => (
                  <div className='space-y-2'>
                    <label className='font-medium'>{t('tenant.import.format', 'Format')}</label>
                    <SelectField
                      {...field}
                      options={[
                        {
                          label: t('tenant.import.file_format', 'File Upload (CSV, JSON)'),
                          value: 'file'
                        },
                        { label: t('tenant.import.json_format', 'JSON Data'), value: 'json' }
                      ]}
                    />
                  </div>
                )}
              />

              <Controller
                name='file'
                control={control}
                render={({ field }) => (
                  <div className='space-y-2'>
                    <label className='font-medium'>{t('tenant.import.file', 'Upload File')}</label>
                    <UploaderField
                      {...field}
                      accept='.json,.csv'
                      maxSize={5 * 1024 * 1024} // 5MB
                      disabled={control._formValues.format !== 'file'}
                    />
                    <p className='text-xs text-slate-500'>
                      {t('tenant.import.file_hint', 'Supported formats: CSV, JSON (max 5MB)')}
                    </p>
                  </div>
                )}
              />

              <Controller
                name='jsonData'
                control={control}
                render={({ field }) => (
                  <div className='space-y-2'>
                    <label className='font-medium'>
                      {t('tenant.import.json_data', 'JSON Data')}
                    </label>
                    <Textarea
                      {...field}
                      placeholder={t('tenant.import.json_placeholder', 'Paste your JSON data here')}
                      rows={8}
                      disabled={control._formValues.format !== 'json'}
                      className='font-mono text-sm'
                    />
                  </div>
                )}
              />
            </div>
          </Section>

          <Section
            title={t('tenant.import.options_section', 'Import Options')}
            subtitle={t(
              'tenant.import.options_description',
              'Configure how to handle conflicts and validation'
            )}
            icon='IconSettings'
          >
            <div className='space-y-4'>
              <Controller
                name='conflictStrategy'
                control={control}
                defaultValue='skip'
                render={({ field }) => (
                  <div className='space-y-2'>
                    <label className='font-medium'>
                      {t('tenant.import.conflict_strategy', 'On Conflict')}
                    </label>
                    <SelectField
                      {...field}
                      options={[
                        { label: t('tenant.import.strategy_skip', 'Skip'), value: 'skip' },
                        { label: t('tenant.import.strategy_update', 'Update'), value: 'update' },
                        { label: t('tenant.import.strategy_replace', 'Replace'), value: 'replace' }
                      ]}
                    />
                  </div>
                )}
              />

              <Controller
                name='validateBeforeImport'
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <div className='flex items-center justify-between'>
                    <label className='font-medium'>
                      {t('tenant.import.validate', 'Validate Before Import')}
                    </label>
                    <input type='checkbox' {...field} />
                  </div>
                )}
              />
            </div>
          </Section>

          <div className='flex justify-end space-x-2 pt-4'>
            <Button type='button' variant='outline' onClick={onCancel}>
              {t('actions.cancel', 'Cancel')}
            </Button>
            <Button type='submit'>
              <Icons name='IconUpload' className='mr-2' />
              {t('tenant.import.submit', 'Import Tenants')}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};
