import React, { useState } from 'react';

import { Button, Icons, Form } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TemplateField, TemplateFieldOption } from '../template';

interface TemplateFieldEditorProps {
  field: TemplateField;
  index: number;
  onUpdate: (_field: Partial<TemplateField>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export const TemplateFieldEditor: React.FC<TemplateFieldEditorProps> = ({
  field,
  index,
  onUpdate,
  onRemove,
  onDuplicate
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<TemplateField>({
    defaultValues: field
  });

  const watchedField = watch();

  React.useEffect(() => {
    onUpdate(watchedField);
  }, [watchedField, onUpdate]);

  const addOption = () => {
    const currentOptions = watchedField.options || [];
    const newOption: TemplateFieldOption = {
      label: `Option ${currentOptions.length + 1}`,
      value: `option_${currentOptions.length + 1}`
    };
    setValue('options', [...currentOptions, newOption]);
  };

  const updateOption = (optionIndex: number, option: Partial<TemplateFieldOption>) => {
    const currentOptions = watchedField.options || [];
    const updatedOptions = currentOptions.map((opt, idx) =>
      idx === optionIndex ? { ...opt, ...option } : opt
    );
    setValue('options', updatedOptions);
  };

  const removeOption = (optionIndex: number) => {
    const currentOptions = watchedField.options || [];
    setValue(
      'options',
      currentOptions.filter((_, idx) => idx !== optionIndex)
    );
  };

  const basicFields = [
    {
      title: t('template.field_editor.field_name'),
      name: 'name',
      type: 'text',
      rules: { required: t('forms.field_required') }
    },
    {
      title: t('template.field_editor.field_label'),
      name: 'label',
      type: 'text',
      rules: { required: t('forms.field_required') }
    },
    {
      title: t('template.field_editor.field_type'),
      name: 'type',
      type: 'select',
      options: [
        { label: t('template.field_types.text'), value: 'text' },
        { label: t('template.field_types.textarea'), value: 'textarea' },
        { label: t('template.field_types.select'), value: 'select' },
        { label: t('template.field_types.number'), value: 'number' },
        { label: t('template.field_types.date'), value: 'date' },
        { label: t('template.field_types.image'), value: 'image' },
        { label: t('template.field_types.rich_text'), value: 'rich_text' },
        { label: t('template.field_types.repeater'), value: 'repeater' }
      ]
    },
    {
      title: t('template.field_editor.required'),
      name: 'required',
      type: 'switch'
    }
  ];

  const advancedFields = [
    {
      title: t('template.field_editor.default_value'),
      name: 'default_value',
      type: 'text'
    },
    {
      title: t('template.field_editor.placeholder'),
      name: 'placeholder',
      type: 'text'
    },
    {
      title: t('template.field_editor.description'),
      name: 'description',
      type: 'textarea',
      rows: 2
    }
  ];

  return (
    <div className='space-y-4'>
      {/* Field Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='flex items-center space-x-2'>
            <Icons name='IconGripVertical' size={16} className='text-gray-400 cursor-move' />
            <span className='text-sm font-medium'>#{index + 1}</span>
          </div>
          <div>
            <div className='font-medium'>{watchedField.label || 'Untitled Field'}</div>
            <div className='text-sm text-gray-500'>
              {watchedField.name} • {t(`template.field_types.${watchedField.type}`)}
              {watchedField.required && ` • ${t('common.required')}`}
            </div>
          </div>
        </div>

        <div className='flex items-center space-x-1'>
          <Button variant='ghost' size='xs' onClick={() => setIsExpanded(!isExpanded)}>
            <Icons name={isExpanded ? 'IconChevronUp' : 'IconChevronDown'} size={16} />
          </Button>
          <Button variant='ghost' size='xs' onClick={onDuplicate}>
            <Icons name='IconCopy' size={16} />
          </Button>
          <Button variant='ghost' size='xs' onClick={onRemove} className='text-red-600'>
            <Icons name='IconTrash' size={16} />
          </Button>
        </div>
      </div>

      {/* Field Configuration */}
      {isExpanded && (
        <div className='space-y-4 pt-4 border-t border-gray-200'>
          {/* Basic Settings */}
          <div>
            <h5 className='font-medium mb-3'>{t('template.field_editor.basic_settings')}</h5>
            <Form
              control={control}
              errors={errors}
              fields={basicFields}
              className='grid grid-cols-2 gap-4'
            />
          </div>

          {/* Field Options (for select type) */}
          {watchedField.type === 'select' && (
            <div>
              <div className='flex items-center justify-between mb-3'>
                <h5 className='font-medium'>{t('template.field_editor.options')}</h5>
                <Button size='xs' onClick={addOption}>
                  <Icons name='IconPlus' size={14} className='mr-1' />
                  {t('template.field_editor.add_option')}
                </Button>
              </div>
              <div className='space-y-2'>
                {watchedField.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className='flex items-center space-x-2'>
                    <input
                      type='text'
                      value={option.label}
                      onChange={e => updateOption(optionIndex, { label: e.target.value })}
                      placeholder={t('template.field_editor.option_label')}
                      className='flex-1 px-2 py-1 text-sm border border-gray-300 rounded'
                    />
                    <input
                      type='text'
                      value={option.value}
                      onChange={e => updateOption(optionIndex, { value: e.target.value })}
                      placeholder={t('template.field_editor.option_value')}
                      className='flex-1 px-2 py-1 text-sm border border-gray-300 rounded'
                    />
                    <Button
                      variant='ghost'
                      size='xs'
                      onClick={() => removeOption(optionIndex)}
                      className='text-red-600'
                    >
                      <Icons name='IconX' size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Rules */}
          {['text', 'textarea', 'number'].includes(watchedField.type) && (
            <div>
              <h5 className='font-medium mb-3'>{t('template.field_editor.validation')}</h5>
              <div className='grid grid-cols-2 gap-4'>
                {watchedField.type === 'number' && (
                  <>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        {t('validation.min')}
                      </label>
                      <input
                        type='number'
                        value={watchedField.validation?.min || ''}
                        onChange={e => setValue('validation.min', Number(e.target.value))}
                        className='w-full px-2 py-1 text-sm border border-gray-300 rounded'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        {t('validation.max')}
                      </label>
                      <input
                        type='number'
                        value={watchedField.validation?.max || ''}
                        onChange={e => setValue('validation.max', Number(e.target.value))}
                        className='w-full px-2 py-1 text-sm border border-gray-300 rounded'
                      />
                    </div>
                  </>
                )}
                {['text', 'textarea'].includes(watchedField.type) && (
                  <>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        {t('validation.min_length')}
                      </label>
                      <input
                        type='number'
                        value={watchedField.validation?.min || ''}
                        onChange={e => setValue('validation.min', Number(e.target.value))}
                        className='w-full px-2 py-1 text-sm border border-gray-300 rounded'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        {t('validation.max_length')}
                      </label>
                      <input
                        type='number'
                        value={watchedField.validation?.max || ''}
                        onChange={e => setValue('validation.max', Number(e.target.value))}
                        className='w-full px-2 py-1 text-sm border border-gray-300 rounded'
                      />
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        {t('validation.pattern')}
                      </label>
                      <input
                        type='text'
                        value={watchedField.validation?.pattern || ''}
                        onChange={e => setValue('validation.pattern', e.target.value)}
                        placeholder='^[a-zA-Z0-9]+$'
                        className='w-full px-2 py-1 text-sm border border-gray-300 rounded'
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          <div>
            <h5 className='font-medium mb-3'>{t('template.field_editor.advanced_settings')}</h5>
            <Form control={control} errors={errors} fields={advancedFields} className='space-y-3' />
          </div>
        </div>
      )}
    </div>
  );
};
