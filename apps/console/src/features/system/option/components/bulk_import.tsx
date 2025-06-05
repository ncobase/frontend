import { useState, useCallback } from 'react';

import { useToastMessage, Icons, Button, Modal, Badge } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { createOption } from '../apis';

export const OptionsBulkImport: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const validateOption = (option, index) => {
    const errors = [];

    if (!option.name || typeof option.name !== 'string') {
      errors.push(`Row ${index + 1}: Name is required and must be a string`);
    }

    if (!option.type || !['string', 'number', 'boolean', 'object', 'array'].includes(option.type)) {
      errors.push(`Row ${index + 1}: Type must be one of: string, number, boolean, object, array`);
    }

    if (option.value === undefined || option.value === null) {
      errors.push(`Row ${index + 1}: Value is required`);
    }

    // Validate value based on type
    if (option.type === 'object' || option.type === 'array') {
      try {
        JSON.parse(option.value);
      } catch {
        errors.push(`Row ${index + 1}: Value must be valid JSON for ${option.type} type`);
      }
    }

    if (option.type === 'number' && isNaN(Number(option.value))) {
      errors.push(`Row ${index + 1}: Value must be a valid number`);
    }

    if (
      option.type === 'boolean' &&
      !['true', 'false', '1', '0', 'yes', 'no'].includes(String(option.value).toLowerCase())
    ) {
      errors.push(`Row ${index + 1}: Value must be a valid boolean (true/false, 1/0, yes/no)`);
    }

    return errors;
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!Array.isArray(data)) {
          throw new Error(
            t('options.import.invalid_format', 'File must contain an array of options')
          );
        }

        // Validate all options
        const allErrors = [];
        data.forEach((option, index) => {
          const errors = validateOption(option, index);
          allErrors.push(...errors);
        });

        setValidationErrors(allErrors);
        setPreview(data);
        setShowPreview(true);
      } catch (error) {
        toast.error(t('messages.error'), {
          description:
            error['message'] || t('options.import.parse_failed', 'Failed to parse JSON file')
        });
      }
    },
    [toast, t]
  );

  const handleImport = useCallback(async () => {
    if (validationErrors.length > 0) {
      toast.error(t('messages.error'), {
        description: 'Please fix validation errors before importing'
      });
      return;
    }

    setImporting(true);
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    try {
      for (const option of preview) {
        try {
          await createOption(option);
          successCount++;
        } catch (error) {
          errorCount++;
          errors.push(`${option.name}: ${error['message']}`);
        }
      }

      if (successCount > 0) {
        toast.success(t('messages.success'), {
          description: t('options.import.success', `Successfully imported ${successCount} options`)
        });
      }

      if (errorCount > 0) {
        toast.warning('Import completed with errors', {
          description: `${errorCount} options failed to import. Check console for details.`
        });
        console.error('Import errors:', errors);
      }

      setShowPreview(false);
      setPreview([]);
      setValidationErrors([]);
      onSuccess?.();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('options.import.failed', 'Import failed')
      });
    } finally {
      setImporting(false);
    }
  }, [preview, validationErrors, toast, t, onSuccess]);

  const handleDownloadTemplate = () => {
    const template = [
      {
        name: 'app.max_users',
        type: 'number',
        value: '100',
        autoload: true
      },
      {
        name: 'app.features.notifications',
        type: 'boolean',
        value: 'true',
        autoload: false
      },
      {
        name: 'app.config.theme',
        type: 'object',
        value: JSON.stringify({ primary: '#3b82f6', secondary: '#64748b' }),
        autoload: true
      }
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'options-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className='space-y-4'>
      <div className='border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors'>
        <Icons name='IconUpload' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
        <h3 className='font-medium text-lg mb-2'>{t('options.import.title', 'Import Options')}</h3>
        <p className='text-slate-600 text-sm mb-4 max-w-md mx-auto'>
          {t(
            'options.import.description',
            'Upload a JSON file containing an array of option objects to bulk import system options.'
          )}
        </p>

        <div className='flex gap-3 justify-center items-center'>
          <input
            type='file'
            accept='.json'
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className='hidden'
            id='options-import'
          />
          <label htmlFor='options-import'>
            <Button variant='primary' className='cursor-pointer'>
              <Icons name='IconUpload' className='w-4 h-4 mr-2' />
              {t('options.import.select_file', 'Select JSON File')}
            </Button>
          </label>

          <Button variant='outline' onClick={handleDownloadTemplate}>
            <Icons name='IconDownload' className='w-4 h-4 mr-2' />
            Download Template
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onCancel={() => {
          setShowPreview(false);
          setPreview([]);
          setValidationErrors([]);
        }}
        title={t('options.import.preview_title', 'Import Preview')}
        confirmText={
          validationErrors.length > 0
            ? 'Fix Errors First'
            : t('options.import.confirm', 'Import Options')
        }
        confirmDisabled={validationErrors.length > 0 || importing}
        onConfirm={handleImport}
        className='max-w-6xl'
        loading={importing}
      >
        <div className='space-y-6'>
          {/* Summary */}
          <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
            <div className='flex items-center space-x-2'>
              <Icons name='IconInfoCircle' className='text-blue-500 w-5 h-5' />
              <span className='text-blue-800 font-medium'>
                {t('options.import.preview_info', `Found ${preview.length} options to import`)}
              </span>
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className='bg-red-50 p-4 rounded-lg border border-red-200'>
              <div className='flex items-start space-x-2'>
                <Icons name='IconAlertTriangle' className='text-red-500 w-5 h-5 mt-0.5' />
                <div>
                  <h4 className='text-red-800 font-medium mb-2'>
                    Validation Errors ({validationErrors.length})
                  </h4>
                  <ul className='text-red-700 text-sm space-y-1'>
                    {validationErrors.slice(0, 10).map((error, index) => (
                      <li key={index} className='list-disc list-inside'>
                        {error}
                      </li>
                    ))}
                    {validationErrors.length > 10 && (
                      <li className='text-red-600 italic'>
                        ... and {validationErrors.length - 10} more errors
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Preview Table */}
          <div className='border rounded-lg overflow-hidden'>
            <div className='max-h-96 overflow-y-auto'>
              <table className='w-full text-sm'>
                <thead className='bg-slate-50 sticky top-0'>
                  <tr className='border-b'>
                    <th className='text-left p-3 font-medium'>#</th>
                    <th className='text-left p-3 font-medium'>
                      {t('options.fields.name', 'Name')}
                    </th>
                    <th className='text-left p-3 font-medium'>
                      {t('options.fields.type', 'Type')}
                    </th>
                    <th className='text-left p-3 font-medium'>
                      {t('options.fields.value', 'Value')}
                    </th>
                    <th className='text-left p-3 font-medium'>
                      {t('options.fields.autoload', 'Auto Load')}
                    </th>
                    <th className='text-left p-3 font-medium'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((option, index) => {
                    const errors = validateOption(option, index);
                    const hasErrors = errors.length > 0;

                    return (
                      <tr
                        key={index}
                        className={`border-b ${hasErrors ? 'bg-red-50' : 'bg-white'}`}
                      >
                        <td className='p-3 text-gray-500'>{index + 1}</td>
                        <td className='p-3'>
                          <span
                            className={`font-medium font-mono ${hasErrors ? 'text-red-700' : 'text-gray-900'}`}
                          >
                            {option.name || '<missing>'}
                          </span>
                        </td>
                        <td className='p-3'>
                          <Badge variant={hasErrors ? 'destructive' : 'outline'} size='xs'>
                            {option.type || 'unknown'}
                          </Badge>
                        </td>
                        <td className='p-3'>
                          <div className='max-w-xs truncate font-mono text-xs'>
                            {option.type === 'boolean'
                              ? String(option.value)
                              : option.value?.length > 50
                                ? `${String(option.value).substring(0, 50)}...`
                                : String(option.value) || '<empty>'}
                          </div>
                        </td>
                        <td className='p-3'>
                          <Badge variant={option.autoload ? 'default' : 'secondary'} size='xs'>
                            {option.autoload ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className='p-3'>
                          {hasErrors ? (
                            <Badge variant='destructive' size='xs'>
                              <Icons name='IconX' className='w-3 h-3 mr-1' />
                              Invalid
                            </Badge>
                          ) : (
                            <Badge variant='success' size='xs'>
                              <Icons name='IconCheck' className='w-3 h-3 mr-1' />
                              Valid
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
