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
      parser: (value: string, record: Dictionary) => renderDictionaryValue(value, record.type),
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
          onClick: (record: Dictionary) => {
            const dataStr = JSON.stringify(record, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `dictionary-${record.slug}.json`;
            link.click();
            URL.revokeObjectURL(url);
          }
        },
        {
          title: t('actions.validate', 'Validate'),
          icon: 'IconShieldCheck',
          onClick: (record: Dictionary) => {
            if (record.type === 'enum') {
              console.log('Open enum validation dialog for:', record.slug);
            } else {
              console.log('Validation not available for type:', record.type);
            }
          }
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
    string: 'bg-cyan-100 text-cyan-800',
    number: 'bg-yellow-100 text-yellow-800',
    object: 'bg-pink-100 text-pink-800',
    other: 'bg-slate-100 text-slate-800'
  };

  const typeIcons = {
    config: 'IconSettings',
    enum: 'IconList',
    constant: 'IconLock',
    template: 'IconTemplate',
    string: 'IconText',
    number: 'IconNumbers',
    object: 'IconBraces',
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
const renderDictionaryValue = (value: string, type: string) => {
  if (!value) return '-';

  let displayValue = value;
  let isJson = false;

  // Check if it's JSON-like type
  if (['object', 'enum'].includes(type)) {
    try {
      JSON.parse(value);
      isJson = true;
      displayValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
    } catch {
      // Not valid JSON, treat as string
      displayValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
    }
  } else {
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
