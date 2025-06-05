import { useCallback } from 'react';

import { Modal, InputField, SelectField, Textarea, useToastMessage } from '@ncobase/react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { updateDictionary, createDictionary } from '../apis';

import { DictionaryValuePreview } from './value_preview';

interface DictionaryFormProps {
  isOpen: boolean;
  onClose: () => void;
  dictionary?: any;
  onSuccess?: () => void;
}

export const DictionaryForm: React.FC<DictionaryFormProps> = ({
  isOpen,
  onClose,
  dictionary,
  onSuccess
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const isEdit = !!dictionary?.id;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: dictionary?.name || '',
      slug: dictionary?.slug || '',
      type: dictionary?.type || 'string',
      value: dictionary?.value || '',
      description: dictionary?.description || ''
    }
  });

  const watchType = watch('type');

  // Auto-generate slug from name
  const handleNameChange = useCallback(
    (name: string) => {
      if (!isEdit) {
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        setValue('slug', slug);
      }
    },
    [isEdit, setValue]
  );

  const onSubmit = useCallback(
    async data => {
      try {
        if (isEdit) {
          await updateDictionary({ id: dictionary.id, ...data });
        } else {
          await createDictionary(data);
        }

        toast.success(t('messages.success'), {
          description: isEdit
            ? t('dictionary.messages.update_success')
            : t('dictionary.messages.create_success')
        });

        onSuccess?.();
        onClose();
      } catch (error) {
        toast.error(t('messages.error'), {
          description: error['message'] || t('dictionary.messages.save_failed')
        });
      }
    },
    [isEdit, dictionary?.id, toast, t, onSuccess, onClose]
  );

  // Validate JSON for object type
  const validateValue = useCallback(
    (value: string) => {
      if (watchType === 'object' && value) {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return t('dictionary.validation.invalid_json');
        }
      }
      return true;
    },
    [watchType, t]
  );

  return (
    <Modal
      isOpen={isOpen}
      onCancel={onClose}
      title={isEdit ? t('dictionary.edit.title') : t('dictionary.create.title')}
      description={
        isEdit
          ? t('dictionary.edit.description', { name: dictionary?.name })
          : t('dictionary.create.description')
      }
      confirmText={t(isEdit ? 'actions.update' : 'actions.create')}
      onConfirm={handleSubmit(onSubmit)}
      className='max-w-2xl'
    >
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <Controller
            name='name'
            control={control}
            rules={{ required: t('forms.input_required') }}
            render={({ field }) => (
              <InputField
                label={t('dictionary.fields.name')}
                placeholder={t('dictionary.placeholders.name')}
                error={errors.name?.message}
                {...field}
                onChange={e => {
                  field.onChange(e);
                  handleNameChange(e.target.value);
                }}
              />
            )}
          />

          <Controller
            name='slug'
            control={control}
            rules={{
              required: t('forms.input_required'),
              pattern: {
                value: /^[a-z0-9-_]+$/,
                message: t('forms.slug_pattern')
              }
            }}
            render={({ field }) => (
              <InputField
                label={t('dictionary.fields.slug')}
                placeholder={t('dictionary.placeholders.slug')}
                error={errors.slug?.message}
                disabled={isEdit}
                {...field}
              />
            )}
          />
        </div>

        <Controller
          name='type'
          control={control}
          rules={{ required: t('forms.select_required') }}
          render={({ field }) => (
            <SelectField
              label={t('dictionary.fields.type')}
              options={[
                { label: t('dictionary.types.string'), value: 'string' },
                { label: t('dictionary.types.number'), value: 'number' },
                { label: t('dictionary.types.object'), value: 'object' }
              ]}
              error={errors.type?.message}
              {...field}
            />
          )}
        />

        <Controller
          name='value'
          control={control}
          rules={{
            required: t('forms.input_required'),
            validate: validateValue
          }}
          render={({ field }) => (
            <div>
              <label className='block text-sm font-medium mb-2'>
                {t('dictionary.fields.value')}
              </label>
              {watchType === 'object' ? (
                <Textarea
                  placeholder={t('dictionary.placeholders.value_object')}
                  rows={6}
                  className='font-mono'
                  {...field}
                />
              ) : (
                <InputField
                  type={watchType === 'number' ? 'number' : 'text'}
                  placeholder={t(`dictionary.placeholders.value_${watchType}`)}
                  error={errors.value?.message}
                  {...field}
                />
              )}
              {watchType === 'object' && (
                <p className='text-xs text-slate-500 mt-1'>{t('dictionary.hints.json_format')}</p>
              )}
            </div>
          )}
        />

        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <Textarea
              label={t('dictionary.fields.description')}
              placeholder={t('dictionary.placeholders.description')}
              rows={3}
              {...field}
            />
          )}
        />

        {/* Preview */}
        {watchType && (
          <div className='bg-slate-50 p-3 rounded-lg'>
            <div className='text-sm font-medium mb-2'>{t('dictionary.preview.title')}</div>
            <DictionaryValuePreview type={watchType} value={watch('value')} t={t} />
          </div>
        )}
      </div>
    </Modal>
  );
};
