import { useState } from 'react';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  InputField,
  SelectField,
  Switch,
  Textarea,
  Button
} from '@ncobase/react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const AdvancedOptionForm: React.FC<{
  option?: any;
  onSave: Function;
  onCancel: Function;
}> = ({ option, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('basic');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: option?.name || '',
      type: option?.type || 'string',
      value: option?.value || '',
      autoload: option?.autoload || false,
      category: option?.category || 'general',
      description: option?.description || '',
      validation: option?.validation || '',
      is_secret: option?.is_secret || false,
      environment_variable: option?.environment_variable || '',
      ...option
    }
  });

  const watchType = watch('type');
  const watchIsSecret = watch('is_secret');

  return (
    <form onSubmit={handleSubmit(onSave as any)} className='space-y-6'>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='basic'>{t('options.form.tabs.basic')}</TabsTrigger>
          <TabsTrigger value='validation'>{t('options.form.tabs.validation')}</TabsTrigger>
          <TabsTrigger value='advanced'>{t('options.form.tabs.advanced')}</TabsTrigger>
        </TabsList>

        {/* Basic Settings */}
        <TabsContent value='basic' className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Controller
              name='name'
              control={control}
              rules={{ required: t('forms.input_required') }}
              render={({ field }) => (
                <InputField
                  label={t('options.fields.name')}
                  placeholder={t('options.placeholders.name')}
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name='type'
              control={control}
              render={({ field }) => (
                <SelectField
                  label={t('options.fields.type')}
                  options={[
                    { label: t('options.types.string'), value: 'string' },
                    { label: t('options.types.number'), value: 'number' },
                    { label: t('options.types.boolean'), value: 'boolean' },
                    { label: t('options.types.json'), value: 'json' },
                    { label: t('options.types.url'), value: 'url' },
                    { label: t('options.types.email'), value: 'email' },
                    { label: t('options.types.password'), value: 'password' }
                  ]}
                  {...field}
                />
              )}
            />
          </div>

          <Controller
            name='value'
            control={control}
            render={({ field }) => (
              <div>
                {watchType === 'boolean' ? (
                  <div className='flex items-center space-x-2'>
                    <Switch
                      checked={field.value === 'true' || field.value === true}
                      onCheckedChange={checked => field.onChange(checked.toString())}
                    />
                    <span>{t('options.fields.value')}</span>
                  </div>
                ) : watchType === 'json' ? (
                  <Textarea
                    value={t('options.fields.value')}
                    placeholder={t('options.placeholders.value_json')}
                    rows={6}
                    className='font-mono'
                    {...field}
                  />
                ) : (
                  <InputField
                    value={t('options.fields.value')}
                    type={
                      watchIsSecret
                        ? 'password'
                        : watchType === 'number'
                          ? 'number'
                          : watchType === 'email'
                            ? 'email'
                            : watchType === 'url'
                              ? 'url'
                              : 'text'
                    }
                    placeholder={t(`options.placeholders.value_${watchType}`)}
                    {...field}
                  />
                )}
              </div>
            )}
          />

          <div className='flex items-center space-x-6'>
            <Controller
              name='autoload'
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className='flex items-center space-x-2'>
                  <Switch checked={value} onCheckedChange={onChange} />
                  <span>{t('options.fields.autoload')}</span>
                </div>
              )}
            />

            <Controller
              name='is_secret'
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className='flex items-center space-x-2'>
                  <Switch checked={value} onCheckedChange={onChange} />
                  <span>{t('options.fields.is_secret')}</span>
                </div>
              )}
            />
          </div>
        </TabsContent>

        {/* Validation Settings */}
        <TabsContent value='validation' className='space-y-4'>
          <Controller
            name='validation'
            control={control}
            render={({ field }) => (
              <Textarea
                value={t('options.fields.validation')}
                placeholder={t('options.placeholders.validation')}
                title={t('options.hints.validation_rules')}
                rows={4}
                {...field}
              />
            )}
          />

          <div className='bg-blue-50 p-4 rounded-lg'>
            <h4 className='font-medium mb-2'>{t('options.validation.examples')}</h4>
            <div className='space-y-1 text-sm'>
              <div>
                <code>required</code> - {t('options.validation.required')}
              </div>
              <div>
                <code>min:5</code> - {t('options.validation.min_length')}
              </div>
              <div>
                <code>max:100</code> - {t('options.validation.max_length')}
              </div>
              <div>
                <code>email</code> - {t('options.validation.email_format')}
              </div>
              <div>
                <code>url</code> - {t('options.validation.url_format')}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value='advanced' className='space-y-4'>
          <Controller
            name='environment_variable'
            control={control}
            render={({ field }) => (
              <InputField
                label={t('options.fields.environment_variable')}
                placeholder={t('options.placeholders.environment_variable')}
                description={t('options.hints.environment_variable')}
                {...field}
              />
            )}
          />

          <Controller
            name='category'
            control={control}
            render={({ field }) => (
              <SelectField
                label={t('options.fields.category')}
                options={[
                  { label: t('options.categories.general'), value: 'general' },
                  { label: t('options.categories.security'), value: 'security' },
                  { label: t('options.categories.email'), value: 'email' },
                  { label: t('options.categories.ui'), value: 'ui' },
                  { label: t('options.categories.performance'), value: 'performance' },
                  { label: t('options.categories.integrations'), value: 'integrations' },
                  { label: t('options.categories.backup'), value: 'backup' }
                ]}
                {...field}
              />
            )}
          />

          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <Textarea
                title={t('options.fields.description')}
                placeholder={t('options.placeholders.description')}
                rows={3}
                {...field}
              />
            )}
          />
        </TabsContent>
      </Tabs>

      <div className='flex justify-end space-x-2 pt-4 border-t'>
        <Button type='button' variant='outline' onClick={() => onCancel}>
          {t('actions.cancel')}
        </Button>
        <Button type='submit'>{option?.id ? t('actions.update') : t('actions.create')}</Button>
      </div>
    </form>
  );
};
