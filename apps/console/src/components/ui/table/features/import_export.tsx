import React from 'react';

import Papa from 'papaparse';
import * as XLSX from 'xlsx';

import { useTable } from '../table.context';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icon';

export const ImportExportFeature: React.FC = () => {
  const { internalData, columns, setInternalData, setOriginalData } = useTable();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const extension = file.name.split('.').pop()?.toLowerCase();

        if (extension === 'csv') {
          // Parse CSV
          const csvData = Papa.parse(e.target?.result as string, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
          });

          if (csvData.data && Array.isArray(csvData.data)) {
            setInternalData(csvData.data);
            setOriginalData(csvData.data);
          }
        } else if (['xlsx', 'xls'].includes(extension || '')) {
          // Parse Excel
          const workbook = XLSX.read(e.target?.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          setInternalData(data);
          setOriginalData(data);
        }
      } catch (error) {
        console.error('Error parsing file:', error);
      }
    };

    if (['csv', 'txt'].includes(file.name.split('.').pop()?.toLowerCase() || '')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const exportToCSV = () => {
    if (!internalData || internalData.length === 0) return;

    const visibleColumns = columns.filter(col => col.visible !== false);
    const headers = visibleColumns.map(col => col.title || col.dataIndex || '');
    const keys = visibleColumns.map(col => col.dataIndex || '');

    const csvContent = Papa.unparse({
      fields: headers.map(header => (typeof header === 'function' ? header({}) : header)),
      data: internalData.map(row => {
        const exportRow: Record<string, any> = {};
        keys.forEach((key, index) => {
          if (key) {
            const header = headers[index];
            const headerValue = typeof header === 'function' ? header(row) : header;
            exportRow[headerValue] = row[key];
          }
        });
        return exportRow;
      })
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'table_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (!internalData || internalData.length === 0) return;

    const visibleColumns = columns.filter(col => col.visible !== false);
    const headers = visibleColumns.map(col => col.title || col.dataIndex || '');
    const keys = visibleColumns.map(col => col.dataIndex || '');

    const excelData = internalData.map(row => {
      const exportRow: Record<string, any> = {};
      keys.forEach((key, index) => {
        if (key) {
          const header = headers[index];
          const headerValue = typeof header === 'function' ? header(row) : header;
          exportRow[headerValue] = row[key];
        }
      });
      return exportRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Table Data');
    XLSX.writeFile(workbook, 'table_export.xlsx');
  };

  return (
    <div className='flex items-center gap-2'>
      <input
        type='file'
        accept='.csv,.xlsx,.xls'
        onChange={handleFileUpload}
        className='hidden'
        id='file-upload'
      />
      <label htmlFor='file-upload'>
        <Button variant='slate' className='flex items-center gap-1 py-2'>
          <Icons name='IconUpload' size={16} />
          Import
        </Button>
      </label>
      <Button variant='slate' className='flex items-center gap-1 py-2' onClick={exportToCSV}>
        <Icons name='IconDownload' size={16} />
        Export CSV
      </Button>
      <Button variant='slate' className='flex items-center gap-1 py-2' onClick={exportToExcel}>
        <Icons name='IconTable' size={16} />
        Export Excel
      </Button>
    </div>
  );
};
