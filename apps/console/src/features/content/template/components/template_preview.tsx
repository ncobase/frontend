import React, { useState } from 'react';

import { Card, Button, Icons, Badge } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { ContentTemplate, TemplateField } from '../template';

interface TemplatePreviewProps {
  template: ContentTemplate;
  showActions?: boolean;
  onUse?: () => void;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  showActions = true,
  onUse
}) => {
  const { t } = useTranslation();
  const [previewData, setPreviewData] = useState<Record<string, any>>({});

  const renderFieldPreview = (field: TemplateField) => {
    const value = previewData[field.name] || field.default_value || '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type='text'
            value={value}
            onChange={e => setPreviewData(prev => ({ ...prev, [field.name]: e.target.value }))}
            placeholder={field.placeholder || field.label}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
            disabled={!showActions}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={e => setPreviewData(prev => ({ ...prev, [field.name]: e.target.value }))}
            placeholder={field.placeholder || field.label}
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none'
            disabled={!showActions}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={e => setPreviewData(prev => ({ ...prev, [field.name]: e.target.value }))}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
            disabled={!showActions}
          >
            <option value=''>{t('common.select_option')}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type='number'
            value={value}
            onChange={e => setPreviewData(prev => ({ ...prev, [field.name]: e.target.value }))}
            placeholder={field.placeholder || field.label}
            min={field.validation?.min}
            max={field.validation?.max}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
            disabled={!showActions}
          />
        );

      case 'date':
        return (
          <input
            type='date'
            value={value}
            onChange={e => setPreviewData(prev => ({ ...prev, [field.name]: e.target.value }))}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
            disabled={!showActions}
          />
        );

      case 'image':
        return (
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center'>
            {value ? (
              <div className='space-y-2'>
                <img src={value} alt={field.label} className='max-h-32 mx-auto rounded' />
                <div className='text-sm text-gray-500'>{field.label}</div>
              </div>
            ) : (
              <div className='space-y-2'>
                <Icons name='IconPhoto' size={32} className='mx-auto text-gray-400' />
                <div className='text-sm text-gray-500'>
                  {field.placeholder || t('template.upload_image')}
                </div>
              </div>
            )}
          </div>
        );

      case 'rich_text':
        return (
          <div className='border border-gray-300 rounded-md'>
            <div className='bg-gray-50 px-3 py-2 border-b border-gray-300 flex items-center space-x-2'>
              <Icons name='IconBold' size={16} className='text-gray-600' />
              <Icons name='IconItalic' size={16} className='text-gray-600' />
              <Icons name='IconUnderline' size={16} className='text-gray-600' />
            </div>
            <textarea
              value={value}
              onChange={e => setPreviewData(prev => ({ ...prev, [field.name]: e.target.value }))}
              placeholder={field.placeholder || field.label}
              rows={4}
              className='w-full px-3 py-2 text-sm resize-none border-0 focus:ring-0'
              disabled={!showActions}
            />
          </div>
        );

      case 'repeater':
        return (
          <div className='space-y-2'>
            <div className='border border-gray-300 rounded-md p-3'>
              <div className='text-sm text-gray-600'>{t('template.repeater_item')} 1</div>
              <div className='mt-2 text-sm text-gray-500'>{t('template.repeater_preview')}</div>
            </div>
            <Button variant='outline' size='sm' className='w-full' disabled={!showActions}>
              <Icons name='IconPlus' size={16} className='mr-1' />
              {t('template.add_item')}
            </Button>
          </div>
        );

      default:
        return (
          <div className='text-sm text-gray-500 italic'>
            {t('template.unsupported_field_type')}: {field.type}
          </div>
        );
    }
  };

  return (
    <div className='space-y-6'>
      {/* Template Header */}
      <Card className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold'>{t('template.preview.title')}</h3>
          {showActions && onUse && (
            <Button onClick={onUse}>
              <Icons name='IconRocketLaunch' size={16} className='mr-2' />
              {t('template.actions.use')}
            </Button>
          )}
        </div>

        {/* Template Info */}
        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
          <div className='flex items-start space-x-4'>
            <div className='w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'>
              <Icons name='IconTemplate' size={24} className='text-white' />
            </div>
            <div className='flex-1'>
              <h4 className='font-medium text-gray-900'>{template.name}</h4>
              <p className='text-sm text-gray-600 mt-1'>{template.description}</p>
              <div className='flex items-center space-x-2 mt-2'>
                <Badge variant='primary' className='text-xs'>
                  {t(`template.types.${template.type}`)}
                </Badge>
                {template.category && (
                  <Badge variant='secondary' className='text-xs'>
                    {t(`template.categories.${template.category}`)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Template Fields Preview */}
        <div className='space-y-4'>
          <h5 className='font-medium text-gray-900'>{t('template.fields.title')}</h5>
          {template.fields
            .sort((a, b) => a.order - b.order)
            .map(field => (
              <div key={field.id} className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label className='text-sm font-medium text-gray-700'>
                    {field.label}
                    {field.required && <span className='text-red-500 ml-1'>*</span>}
                  </label>
                  <Badge variant='secondary' className='text-xs'>
                    {t(`template.field_types.${field.type}`)}
                  </Badge>
                </div>

                {field.description && <p className='text-xs text-gray-500'>{field.description}</p>}

                {renderFieldPreview(field)}

                {field.validation && (
                  <div className='text-xs text-gray-400'>
                    {field.validation.min && (
                      <span>{t('validation.min', { min: field.validation.min })} </span>
                    )}
                    {field.validation.max && (
                      <span>{t('validation.max', { max: field.validation.max })} </span>
                    )}
                    {field.validation.pattern && <span>{t('validation.pattern')}</span>}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* No Fields Message */}
        {template.fields.length === 0 && (
          <div className='text-center py-8 text-gray-500'>
            <Icons name='IconCircleDashed' size={32} className='mx-auto mb-2' />
            <p>{t('template.no_fields')}</p>
          </div>
        )}
      </Card>

      {/* Template Data Structure */}
      <Card className='p-6'>
        <h4 className='font-medium text-gray-900 mb-4'>{t('template.data_structure')}</h4>
        <div className='bg-gray-900 rounded-lg p-4 overflow-x-auto'>
          <pre className='text-green-400 text-sm'>
            <code>{JSON.stringify(template.template_data, null, 2)}</code>
          </pre>
        </div>
      </Card>
    </div>
  );
};
