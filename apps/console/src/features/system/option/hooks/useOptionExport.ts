import { useCallback } from 'react';

import { useToastMessage } from '@ncobase/react';

import { useExportOptions } from '../service';

export const useOptionExport = () => {
  const { refetch: exportOptions, isLoading } = useExportOptions();
  const toast = useToastMessage();

  const exportToJson = useCallback(async () => {
    try {
      const result = await exportOptions();
      const data = result.data || [];

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-options-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Export successful', {
        description: `Exported ${data.length} options to JSON file`
      });
    } catch (error) {
      toast.error('Export failed', {
        description: error['message'] || 'Failed to export options'
      });
    }
  }, [exportOptions, toast]);

  const exportToCsv = useCallback(async () => {
    try {
      const result = await exportOptions();
      const data = result.data || [];

      const headers = ['Name', 'Type', 'Value', 'Auto Load', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...data.map(option =>
          [
            `"${option.name}"`,
            `"${option.type}"`,
            `"${option.value?.replace(/"/g, '""') || ''}"`,
            option.autoload ? 'Yes' : 'No',
            option.created_at ? new Date(option.created_at).toISOString() : ''
          ].join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-options-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Export successful', {
        description: `Exported ${data.length} options to CSV file`
      });
    } catch (error) {
      toast.error('Export failed', {
        description: error['message'] || 'Failed to export options'
      });
    }
  }, [exportOptions, toast]);

  return {
    exportToJson,
    exportToCsv,
    isExporting: isLoading
  };
};
