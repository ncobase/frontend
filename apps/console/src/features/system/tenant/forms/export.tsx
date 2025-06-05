import { useCallback, useState } from 'react';

import {
  Card,
  CardContent,
  Section,
  SelectField,
  Icons,
  Button,
  Progress,
  Checkbox,
  Form
} from '@ncobase/react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const TenantExportForm = ({ onSubmit, onCancel, tenantCount = 0, selectedTenants = [] }) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      format: 'json',
      scope: selectedTenants.length > 0 ? 'selected' : 'all',
      includeMetadata: true,
      includeSettings: false,
      includeUsers: false,
      includeQuotas: false,
      includeBilling: false
    }
  });

  const selectedScope = watch('scope');
  const exportFormat = watch('format');

  // Calculate export count based on scope
  const getExportCount = useCallback(() => {
    switch (selectedScope) {
      case 'selected':
        return selectedTenants.length;
      case 'all':
        return tenantCount;
      default:
        return 0;
    }
  }, [selectedScope, selectedTenants.length, tenantCount]);

  // Simulate export process
  const simulateExport = useCallback(
    async data => {
      setIsExporting(true);
      setExportProgress(0);

      const count = getExportCount();

      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setExportProgress(i);
      }

      setExportComplete(true);
      setIsExporting(false);

      // Simulate file download
      const exportData = {
        format: data.format,
        count,
        timestamp: new Date().toISOString(),
        data: [] // This would contain actual tenant data
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tenants-export-${Date.now()}.${data.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [getExportCount]
  );

  const exportFormSubmit = useCallback(
    handleSubmit(async data => {
      try {
        await simulateExport(data);
        if (onSubmit) {
          onSubmit(data);
        }
      } catch (error) {
        console.error('Export failed:', error);
      }
    }),
    [handleSubmit, simulateExport, onSubmit]
  );

  return (
    <Card>
      <CardContent className='p-0'>
        <Form
          id='tenant-export-form'
          className='space-y-6'
          onSubmit={exportFormSubmit}
          control={control}
          errors={errors}
        >
          {/* Export Format */}
          <Section
            title={t('tenant.export.format_section', 'Export Format')}
            subtitle={t('tenant.export.format_description', 'Choose export format and scope')}
            icon='IconFileDownload'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Controller
                name='format'
                control={control}
                render={({ field }) => (
                  <SelectField
                    label={t('tenant.export.format', 'Export Format')}
                    {...field}
                    options={[
                      { label: 'JSON', value: 'json' },
                      { label: 'CSV', value: 'csv' },
                      { label: 'Excel (XLSX)', value: 'xlsx' }
                    ]}
                  />
                )}
              />

              <Controller
                name='scope'
                control={control}
                render={({ field }) => (
                  <SelectField
                    label={t('tenant.export.scope', 'Export Scope')}
                    {...field}
                    options={[
                      {
                        label: t('tenant.export.scope_all', 'All Tenants ({{count}})', {
                          count: tenantCount
                        }),
                        value: 'all'
                      },
                      ...(selectedTenants.length > 0
                        ? [
                            {
                              label: t(
                                'tenant.export.scope_selected',
                                'Selected Tenants ({{count}})',
                                { count: selectedTenants.length }
                              ),
                              value: 'selected'
                            }
                          ]
                        : []),
                      {
                        label: t('tenant.export.scope_active', 'Active Tenants Only'),
                        value: 'active'
                      },
                      {
                        label: t('tenant.export.scope_disabled', 'Disabled Tenants Only'),
                        value: 'disabled'
                      }
                    ]}
                  />
                )}
              />
            </div>

            {/* Export Summary */}
            <div className='mt-4 p-3 bg-blue-50 rounded border border-blue-200'>
              <div className='flex items-center space-x-2'>
                <Icons name='IconInfoCircle' className='text-blue-500' />
                <span className='text-blue-800'>
                  {t(
                    'tenant.export.summary',
                    'Will export {{count}} tenants in {{format}} format',
                    {
                      count: getExportCount(),
                      format: exportFormat.toUpperCase()
                    }
                  )}
                </span>
              </div>
            </div>
          </Section>

          {/* Export Options */}
          <Section
            title={t('tenant.export.options_section', 'Export Options')}
            subtitle={t('tenant.export.options_description', 'Choose what data to include')}
            icon='IconSettings'
          >
            <div className='space-y-3'>
              <Controller
                name='includeMetadata'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className='flex items-center justify-between p-3 border border-slate-200/65 rounded'>
                    <div>
                      <div className='font-medium'>
                        {t('tenant.export.include_metadata', 'Include Metadata')}
                      </div>
                      <div className='text-sm text-slate-600'>
                        {t('tenant.export.metadata_desc', 'Creation dates, update info, etc.')}
                      </div>
                    </div>
                    <Checkbox checked={value} onChange={onChange} />
                  </div>
                )}
              />

              <Controller
                name='includeSettings'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className='flex items-center justify-between p-3 border border-slate-200/65 rounded'>
                    <div>
                      <div className='font-medium'>
                        {t('tenant.export.include_settings', 'Include Custom Settings')}
                      </div>
                      <div className='text-sm text-slate-600'>
                        {t('tenant.export.settings_desc', 'Tenant-specific configuration')}
                      </div>
                    </div>
                    <Checkbox checked={value} onChange={onChange} />
                  </div>
                )}
              />

              <Controller
                name='includeUsers'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className='flex items-center justify-between p-3 border border-slate-200/65 rounded'>
                    <div>
                      <div className='font-medium'>
                        {t('tenant.export.include_users', 'Include User Assignments')}
                      </div>
                      <div className='text-sm text-slate-600'>
                        {t('tenant.export.users_desc', 'User-tenant-role relationships')}
                      </div>
                    </div>
                    <Checkbox checked={value} onChange={onChange} />
                  </div>
                )}
              />

              <Controller
                name='includeQuotas'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className='flex items-center justify-between p-3 border border-slate-200/65 rounded'>
                    <div>
                      <div className='font-medium'>
                        {t('tenant.export.include_quotas', 'Include Quotas')}
                      </div>
                      <div className='text-sm text-slate-600'>
                        {t('tenant.export.quotas_desc', 'Resource limits and usage')}
                      </div>
                    </div>
                    <Checkbox checked={value} onChange={onChange} />
                  </div>
                )}
              />

              <Controller
                name='includeBilling'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className='flex items-center justify-between p-3 border border-slate-200/65 rounded'>
                    <div>
                      <div className='font-medium'>
                        {t('tenant.export.include_billing', 'Include Billing Data')}
                      </div>
                      <div className='text-sm text-slate-600'>
                        {t('tenant.export.billing_desc', 'Invoices and payment history')}
                      </div>
                    </div>
                    <Checkbox checked={value} onChange={onChange} />
                  </div>
                )}
              />
            </div>
          </Section>

          {/* Export Progress */}
          {isExporting && (
            <Section
              title={t('tenant.export.progress_section', 'Export Progress')}
              icon='IconProgress'
            >
              <div className='space-y-3'>
                <Progress value={exportProgress} className='h-3' />
                <div className='text-center text-sm'>
                  {t('tenant.export.processing', 'Exporting... {{progress}}%', {
                    progress: Math.round(exportProgress)
                  })}
                </div>
              </div>
            </Section>
          )}

          {/* Export Complete */}
          {exportComplete && (
            <Section
              title={t('tenant.export.complete_section', 'Export Complete')}
              icon='IconCheckCircle'
            >
              <div className='text-center p-6'>
                <Icons name='IconDownloadDone' className='w-16 h-16 mx-auto text-green-500 mb-4' />
                <div className='text-lg font-medium text-green-800 mb-2'>
                  {t('tenant.export.success', 'Export completed successfully!')}
                </div>
                <div className='text-sm text-slate-600'>
                  {t('tenant.export.download_started', 'Download should start automatically')}
                </div>
              </div>
            </Section>
          )}

          {/* Action Buttons */}
          <div className='flex justify-end space-x-3 pt-4 border-t border-slate-200/65'>
            <Button type='button' variant='outline' onClick={onCancel}>
              {exportComplete ? t('actions.close', 'Close') : t('actions.cancel', 'Cancel')}
            </Button>
            {!exportComplete && (
              <Button type='submit' disabled={isExporting || getExportCount() === 0}>
                <Icons name='IconDownload' className='mr-2' />
                {isExporting
                  ? t('tenant.export.exporting')
                  : t('tenant.export.submit', 'Export Tenants')}
              </Button>
            )}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};
