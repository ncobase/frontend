import { useState, useCallback } from 'react';

import { useToastMessage, SelectField, Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { createDictionary, getAllDictionaries } from '../apis';

export const DictionaryImportExport: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [importing, setImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');

  const handleImport = useCallback(
    async (file: File) => {
      setImporting(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Validate import data structure
        if (!Array.isArray(data)) {
          throw new Error(t('dictionary.import.invalid_format'));
        }

        // Import dictionaries
        await Promise.all(data.map(dict => createDictionary(dict)));

        toast.success(t('messages.success'), {
          description: t('dictionary.import.success', { count: data.length })
        });
      } catch (error) {
        toast.error(t('messages.error'), {
          description: error['message'] || t('dictionary.import.failed')
        });
      } finally {
        setImporting(false);
      }
    },
    [toast, t]
  );

  const handleExport = useCallback(async () => {
    try {
      const dictionaries = await getAllDictionaries();

      let content: string;
      let filename: string;
      let mimeType: string;

      switch (exportFormat) {
        case 'json':
          content = JSON.stringify(dictionaries, null, 2);
          filename = `dictionaries_${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'csv':
          content = convertToCsv(dictionaries);
          filename = `dictionaries_${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(t('messages.success'), {
        description: t('dictionary.export.success')
      });
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('dictionary.export.failed')
      });
    }
  }, [exportFormat, toast, t]);

  const convertToCsv = (data: any[]) => {
    const headers = ['name', 'slug', 'type', 'value', 'description'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');
    return csvContent;
  };

  return (
    <div className='space-y-4'>
      {/* Import */}
      <div className='border rounded-lg p-4'>
        <h3 className='font-medium mb-3'>{t('dictionary.import.title')}</h3>
        <div className='space-y-3'>
          <input
            type='file'
            accept='.json'
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
            }}
            disabled={importing}
            className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
          />
          {importing && (
            <div className='text-sm text-blue-600'>{t('dictionary.import.processing')}</div>
          )}
        </div>
      </div>

      {/* Export */}
      <div className='border rounded-lg p-4'>
        <h3 className='font-medium mb-3'>{t('dictionary.export.title')}</h3>
        <div className='flex items-center space-x-3'>
          <SelectField
            value={exportFormat}
            onChange={value => setExportFormat(value)}
            options={[
              { label: 'JSON', value: 'json' },
              { label: 'CSV', value: 'csv' }
            ]}
            className='w-32'
          />
          <Button onClick={handleExport}>
            <Icons name='IconDownload' className='mr-2' />
            {t('dictionary.export.download')}
          </Button>
        </div>
      </div>
    </div>
  );
};
