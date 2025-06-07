import React, { useState } from 'react';

import { Modal } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';

interface ContentExportProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems?: any[];
  contentType: 'topics' | 'taxonomies' | 'media' | 'channels' | 'distributions';
}

export const ContentExport: React.FC<ContentExportProps> = ({
  isOpen,
  onClose,
  selectedItems = [],
  contentType
}) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeRelations, setIncludeRelations] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const toast = useToastMessage();

  const exportFormats = [
    { value: 'json', label: 'JSON', description: 'Machine-readable format' },
    { value: 'csv', label: 'CSV', description: 'Spreadsheet compatible' },
    { value: 'xml', label: 'XML', description: 'Structured markup' }
  ];

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const exportData = {
        format: exportFormat,
        contentType,
        items: selectedItems,
        options: {
          includeMetadata,
          includeRelations
        },
        exportDate: new Date().toISOString(),
        count: selectedItems.length
      };

      let content: string;
      let filename: string;
      let mimeType: string;

      switch (exportFormat) {
        case 'csv':
          // Convert to CSV
          if (selectedItems.length > 0) {
            const headers = Object.keys(selectedItems[0]).join(',');
            const rows = selectedItems
              .map(item =>
                Object.values(item)
                  .map(val => (typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val))
                  .join(',')
              )
              .join('\n');
            content = `${headers}\n${rows}`;
          } else {
            content = '';
          }
          filename = `${contentType}-export-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;

        case 'xml':
          // Convert to XML
          content = `<?xml version="1.0" encoding="UTF-8"?>\n<export>\n<metadata>\n<contentType>${contentType}</contentType>\n<count>${selectedItems.length}</count>\n<exportDate>${exportData.exportDate}</exportDate>\n</metadata>\n<items>\n${selectedItems
            .map(
              item =>
                `<item>\n${Object.entries(item)
                  .map(([key, value]) => `<${key}>${value}</${key}>`)
                  .join('\n')}\n</item>`
            )
            .join('\n')}\n</items>\n</export>`;
          filename = `${contentType}-export-${new Date().toISOString().split('T')[0]}.xml`;
          mimeType = 'application/xml';
          break;

        default: // json
          content = JSON.stringify(exportData, null, 2);
          filename = `${contentType}-export-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${selectedItems.length} items exported successfully`);
      onClose();
    } catch (error) {
      toast.error('Export failed. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Export ${contentType}`}
      onCancel={onClose}
      confirmText='Export'
      onConfirm={handleExport}
      confirmDisabled={isExporting}
      loading={isExporting}
    >
      <div className='space-y-6'>
        <div>
          <p className='text-sm text-gray-600 mb-4'>
            Export {selectedItems.length} selected {contentType} to your preferred format.
          </p>
        </div>

        {/* Export Format Selection */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>Export Format</label>
          <div className='space-y-2'>
            {exportFormats.map(format => (
              <label key={format.value} className='flex items-start space-x-3 cursor-pointer'>
                <input
                  type='radio'
                  value={format.value}
                  checked={exportFormat === format.value}
                  onChange={e => setExportFormat(e.target.value)}
                  className='mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                />
                <div>
                  <div className='text-sm font-medium text-gray-900'>{format.label}</div>
                  <div className='text-xs text-gray-500'>{format.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>Export Options</label>
          <div className='space-y-3'>
            <label className='flex items-center space-x-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={includeMetadata}
                onChange={e => setIncludeMetadata(e.target.checked)}
                className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
              />
              <div>
                <div className='text-sm font-medium text-gray-900'>Include Metadata</div>
                <div className='text-xs text-gray-500'>Creation dates, author info, etc.</div>
              </div>
            </label>

            {(contentType === 'topics' || contentType === 'distributions') && (
              <label className='flex items-center space-x-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={includeRelations}
                  onChange={e => setIncludeRelations(e.target.checked)}
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                />
                <div>
                  <div className='text-sm font-medium text-gray-900'>Include Relations</div>
                  <div className='text-xs text-gray-500'>Related media, channels, etc.</div>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className='bg-gray-50 rounded-lg p-4'>
          <h4 className='text-sm font-medium text-gray-900 mb-2'>Export Preview</h4>
          <div className='text-xs text-gray-600 space-y-1'>
            <div>Format: {exportFormats.find(f => f.value === exportFormat)?.label}</div>
            <div>Items: {selectedItems.length}</div>
            <div>Includes metadata: {includeMetadata ? 'Yes' : 'No'}</div>
            {(contentType === 'topics' || contentType === 'distributions') && (
              <div>Includes relations: {includeRelations ? 'Yes' : 'No'}</div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
