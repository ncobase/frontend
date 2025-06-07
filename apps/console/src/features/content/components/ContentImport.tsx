import React, { useState, useCallback } from 'react';

import { Button, Icons, Modal } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useDropzone } from 'react-dropzone';

interface ContentImportProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'topics' | 'taxonomies' | 'media' | 'channels' | 'distributions';
  onImportComplete?: (_data: any[]) => void;
}

export const ContentImport: React.FC<ContentImportProps> = ({
  isOpen,
  onClose,
  contentType,
  onImportComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importOptions, setImportOptions] = useState({
    skipDuplicates: true,
    updateExisting: false,
    preserveIds: false,
    dryRun: false
  });

  const toast = useToastMessage();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);

      try {
        const text = await uploadedFile.text();
        let data;

        if (uploadedFile.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          data = parsed.items || parsed;
        } else if (uploadedFile.name.endsWith('.csv')) {
          // Simple CSV parsing
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index] || '';
              return obj;
            }, {});
          });
        } else if (uploadedFile.name.endsWith('.xml')) {
          // Basic XML parsing for simple structures
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(text, 'text/xml');
          const items = xmlDoc.getElementsByTagName('item');
          data = Array.from(items).map(item => {
            const obj = {};
            Array.from(item.children).forEach(child => {
              obj[child.tagName] = child.textContent;
            });
            return obj;
          });
        }

        setPreviewData(Array.isArray(data) ? data.slice(0, 10) : [data]);
      } catch (error) {
        toast.error('Failed to parse file. Please check the format.');
        setFile(null);
        setPreviewData([]);
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'application/xml': ['.xml']
    },
    multiple: false
  });

  const handleImport = async () => {
    if (!file || previewData.length === 0) return;

    setIsProcessing(true);

    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (importOptions.dryRun) {
        toast.success(`Dry run completed. ${previewData.length} items would be imported.`);
      } else {
        onImportComplete?.(previewData);
        toast.success(`${previewData.length} items imported successfully`);
        onClose();
      }
    } catch (error) {
      toast.error('Import failed. Please try again.');
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImport = () => {
    setFile(null);
    setPreviewData([]);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Import ${contentType}`}
      onCancel={onClose}
      confirmText={file ? (importOptions.dryRun ? 'Test Import' : 'Import') : undefined}
      onConfirm={file ? handleImport : undefined}
      confirmDisabled={isProcessing || !file}
      loading={isProcessing}
      size='xl'
    >
      <div className='space-y-6'>
        {!file ? (
          // File upload area
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Icons name='IconCloudUpload' size={48} className='mx-auto text-gray-400 mb-4' />
            <p className='text-lg font-medium text-gray-700 mb-2'>
              {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
            </p>
            <p className='text-sm text-gray-500 mb-4'>
              or <span className='text-blue-600 font-medium'>browse</span> to choose a file
            </p>
            <p className='text-xs text-gray-400'>Supports JSON, CSV, and XML files</p>
          </div>
        ) : (
          // File preview and options
          <div className='space-y-6'>
            {/* File info */}
            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
              <div className='flex items-center space-x-3'>
                <Icons name='IconFile' size={20} className='text-gray-500' />
                <div>
                  <div className='font-medium text-gray-900'>{file.name}</div>
                  <div className='text-sm text-gray-500'>
                    {(file.size / 1024).toFixed(1)} KB • {previewData.length} items detected
                  </div>
                </div>
              </div>
              <Button variant='ghost' size='sm' onClick={resetImport}>
                <Icons name='IconX' size={16} />
              </Button>
            </div>

            {/* Import options */}
            <div>
              <h4 className='font-medium text-gray-900 mb-3'>Import Options</h4>
              <div className='space-y-3'>
                <label className='flex items-center space-x-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={importOptions.skipDuplicates}
                    onChange={e =>
                      setImportOptions(prev => ({
                        ...prev,
                        skipDuplicates: e.target.checked
                      }))
                    }
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <div>
                    <div className='text-sm font-medium text-gray-900'>Skip Duplicates</div>
                    <div className='text-xs text-gray-500'>
                      Don't import items that already exist
                    </div>
                  </div>
                </label>

                <label className='flex items-center space-x-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={importOptions.updateExisting}
                    onChange={e =>
                      setImportOptions(prev => ({
                        ...prev,
                        updateExisting: e.target.checked
                      }))
                    }
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <div>
                    <div className='text-sm font-medium text-gray-900'>Update Existing</div>
                    <div className='text-xs text-gray-500'>Update items that already exist</div>
                  </div>
                </label>

                <label className='flex items-center space-x-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={importOptions.preserveIds}
                    onChange={e =>
                      setImportOptions(prev => ({
                        ...prev,
                        preserveIds: e.target.checked
                      }))
                    }
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <div>
                    <div className='text-sm font-medium text-gray-900'>Preserve IDs</div>
                    <div className='text-xs text-gray-500'>
                      Keep original IDs from the import file
                    </div>
                  </div>
                </label>

                <label className='flex items-center space-x-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={importOptions.dryRun}
                    onChange={e =>
                      setImportOptions(prev => ({
                        ...prev,
                        dryRun: e.target.checked
                      }))
                    }
                    className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                  />
                  <div>
                    <div className='text-sm font-medium text-gray-900'>Dry Run</div>
                    <div className='text-xs text-gray-500'>
                      Test the import without making changes
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Data preview */}
            {previewData.length > 0 && (
              <div>
                <h4 className='font-medium text-gray-900 mb-3'>Data Preview</h4>
                <div className='border rounded-lg overflow-hidden'>
                  <div className='max-h-64 overflow-y-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          {Object.keys(previewData[0] || {})
                            .slice(0, 4)
                            .map(key => (
                              <th
                                key={key}
                                className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                              >
                                {key}
                              </th>
                            ))}
                          {Object.keys(previewData[0] || {}).length > 4 && (
                            <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                              ...
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {previewData.map((item, index) => (
                          <tr key={index}>
                            {Object.values(item)
                              .slice(0, 4)
                              .map((value: any, valueIndex) => (
                                <td
                                  key={valueIndex}
                                  className='px-4 py-2 text-sm text-gray-900 truncate max-w-xs'
                                >
                                  {String(value)}
                                </td>
                              ))}
                            {Object.keys(item).length > 4 && (
                              <td className='px-4 py-2 text-sm text-gray-500'>
                                +{Object.keys(item).length - 4} more
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {previewData.length < 10 && (
                  <p className='text-xs text-gray-500 mt-2'>
                    Showing all {previewData.length} items.
                  </p>
                )}
                {previewData.length === 10 && (
                  <p className='text-xs text-gray-500 mt-2'>
                    Showing first 10 items. Check the file for all data.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
