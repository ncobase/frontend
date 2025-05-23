import { useCallback } from 'react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Section,
  SelectField,
  Icons,
  Button
} from '@ncobase/react';
import { useForm, Form, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const TenantExportForm = ({ onSubmit, onCancel, tenantCount }) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const exportFormSubmit = useCallback(
    handleSubmit(data => {
      onSubmit(data);
    }),
    [onSubmit, handleSubmit]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tenant.export.title', 'Export Tenants')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          id='tenant-export-form'
          className='space-y-4'
          // @ts-expect-error
          onSubmit={exportFormSubmit}
          control={control}
          errors={errors}
        >
          <Section
            title={t('tenant.export.format_section', 'Export Format')}
            subtitle={t(
              'tenant.export.format_description',
              'Choose how you want to export tenant data'
            )}
            icon='IconDownload'
          >
            <div className='space-y-4'>
              <Controller
                name='format'
                control={control}
                defaultValue='json'
                rules={{ required: true }}
                render={({ field }) => (
                  <div className='space-y-2'>
                    <label className='font-medium'>{t('tenant.export.format', 'Format')}</label>
                    <SelectField
                      {...field}
                      options={[
                        { label: 'JSON', value: 'json' },
                        { label: 'CSV', value: 'csv' },
                        { label: 'Excel', value: 'excel' }
                      ]}
                    />
                  </div>
                )}
              />

              <Controller
                name='scope'
                control={control}
                defaultValue='all'
                render={({ field }) => (
                  <div className='space-y-2'>
                    <label className='font-medium'>
                      {t('tenant.export.scope', 'Export Scope')}
                    </label>
                    <SelectField
                      {...field}
                      options={[
                        { label: t('tenant.export.scope_all', 'All Tenants'), value: 'all' },
                        {
                          label: t('tenant.export.scope_active', 'Active Tenants Only'),
                          value: 'active'
                        },
                        {
                          label: t('tenant.export.scope_disabled', 'Disabled Tenants Only'),
                          value: 'disabled'
                        },
                        {
                          label: t('tenant.export.scope_filtered', 'Current Filtered List'),
                          value: 'filtered'
                        },
                        {
                          label: t('tenant.export.scope_selected', 'Selected Tenants'),
                          value: 'selected'
                        }
                      ]}
                    />
                  </div>
                )}
              />
            </div>
          </Section>

          <Section
            title={t('tenant.export.options_section', 'Export Options')}
            subtitle={t(
              'tenant.export.options_description',
              'Configure what data to include in the export'
            )}
            icon='IconSettings'
          >
            <div className='space-y-4'>
              <Controller
                name='includeMetadata'
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <div className='flex items-center justify-between'>
                    <label className='font-medium'>
                      {t('tenant.export.include_metadata', 'Include Metadata')}
                    </label>
                    <input type='checkbox' {...field} />
                  </div>
                )}
              />

              <Controller
                name='includeAudit'
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <div className='flex items-center justify-between'>
                    <label className='font-medium'>
                      {t('tenant.export.include_audit', 'Include Audit Information')}
                    </label>
                    <input type='checkbox' {...field} />
                  </div>
                )}
              />

              <div className='text-slate-500 bg-slate-50 p-3 rounded'>
                <p className='flex items-center'>
                  <Icons name='IconInfoCircle' className='mr-2 text-blue-500' />
                  {tenantCount
                    ? t('tenant.export.count_info', 'You are about to export {{count}} tenants', {
                        count: tenantCount
                      })
                    : t('tenant.export.no_count_info', 'No tenant count available')}
                </p>
              </div>
            </div>
          </Section>

          <div className='flex justify-end space-x-2 pt-4'>
            <Button type='button' variant='outline' onClick={onCancel}>
              {t('actions.cancel', 'Cancel')}
            </Button>
            <Button type='submit'>
              <Icons name='IconDownload' className='mr-2' />
              {t('tenant.export.submit', 'Export Tenants')}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};
