import { Button, TableViewProps, Badge, Tooltip, Icons } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Dictionary } from '../dictionary';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: t('dictionary.fields.name', 'Name'),
      accessorKey: 'name',
      parser: (value: string, record: Dictionary) => (
        <Button variant='link' size='md' onClick={() => handleView(record, 'view')}>
          <span className='font-medium'>{value}</span>
        </Button>
      ),
      icon: 'IconBook'
    },
    {
      title: t('dictionary.fields.slug', 'Slug'),
      accessorKey: 'slug',
      parser: (value: string) => (
        <span className='text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded'>
          {value || '-'}
        </span>
      ),
      icon: 'IconTag'
    },
    {
      title: t('dictionary.fields.type', 'Type'),
      accessorKey: 'type',
      parser: (value: string) => renderDictionaryType(value),
      icon: 'IconCategory'
    },
    {
      title: t('dictionary.fields.value', 'Value'),
      accessorKey: 'value',
      parser: (value: string) => renderDictionaryValue(value),
      icon: 'IconCode'
    },
    {
      title: t('dictionary.fields.description', 'Description'),
      accessorKey: 'description',
      parser: (value: string) => (
        <Tooltip content={value || 'No description'}>
          <span className='truncate max-w-[200px] text-slate-600'>
            {value ? value.substring(0, 40) + (value.length > 40 ? '...' : '') : '-'}
          </span>
        </Tooltip>
      ),
      icon: 'IconFileText'
    },
    {
      title: t('dictionary.fields.created_at', 'Created'),
      accessorKey: 'created_at',
      parser: (value: string) => (
        <Tooltip content={formatDateTime(value, 'dateTime')}>
          <span>{formatRelativeTime(new Date(value))}</span>
        </Tooltip>
      ),
      icon: 'IconCalendarPlus'
    },
    {
      title: t('common.actions', 'Actions'),
      accessorKey: 'operation-column',
      actions: [
        {
          title: t('actions.view', 'View'),
          icon: 'IconEye',
          onClick: (record: Dictionary) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: Dictionary) => handleView(record, 'edit')
        },
        {
          title: t('actions.duplicate', 'Duplicate'),
          icon: 'IconCopy',
          onClick: (record: Dictionary) => {
            // Create a copy without ID for duplication
            const duplicateRecord = {
              ...record,
              id: undefined,
              name: `${record.name} (Copy)`,
              slug: `${record.slug}-copy`
            };
            handleView(duplicateRecord, 'create');
          }
        },
        {
          title: t('actions.export', 'Export'),
          icon: 'IconDownload',
          onClick: () => console.log('export dictionary')
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: Dictionary) => handleDelete(record)
        }
      ]
    }
  ];
};

// Dictionary type rendering helper
const renderDictionaryType = (type: string) => {
  if (!type) return '-';

  const typeColors = {
    config: 'bg-blue-100 text-blue-800',
    enum: 'bg-green-100 text-green-800',
    constant: 'bg-purple-100 text-purple-800',
    template: 'bg-orange-100 text-orange-800',
    other: 'bg-slate-100 text-slate-800'
  };

  const typeIcons = {
    config: 'IconSettings',
    enum: 'IconList',
    constant: 'IconLock',
    template: 'IconTemplate',
    other: 'IconHelp'
  };

  const lowerType = type.toLowerCase();
  const colorClass = typeColors[lowerType] || 'bg-slate-100 text-slate-800';
  const iconName = typeIcons[lowerType] || 'IconTag';

  return (
    <div className='flex items-center space-x-1'>
      <Icons name={iconName} className='w-3 h-3' />
      <Badge className={colorClass}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
    </div>
  );
};

// Dictionary value rendering helper
const renderDictionaryValue = (value: string) => {
  if (!value) return '-';

  // Try to detect if it's JSON
  let displayValue = value;
  let isJson = false;

  try {
    JSON.parse(value);
    isJson = true;
    displayValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
  } catch {
    // Not JSON, display as plain text
    displayValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
  }

  return (
    <Tooltip content={value}>
      <div className='flex items-center space-x-1'>
        {isJson && <Icons name='IconBraces' className='w-3 h-3 text-blue-500' />}
        <span className='text-slate-600 font-mono text-xs'>{displayValue}</span>
      </div>
    </Tooltip>
  );
};
