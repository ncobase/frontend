import { Button, TableViewProps, Badge, Tooltip, Icons } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Options } from '../options';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: t('options.fields.name', 'Name'),
      accessorKey: 'name',
      parser: (value: string, record: Options) => (
        <Button variant='link' size='md' onClick={() => handleView(record, 'view')}>
          <span className='font-medium font-mono text-sm'>{value}</span>
        </Button>
      ),
      icon: 'IconKey'
    },
    {
      title: t('options.fields.type', 'Type'),
      accessorKey: 'type',
      parser: (value: string) => renderOptionsType(value),
      icon: 'IconTag'
    },
    {
      title: t('options.fields.value', 'Value'),
      accessorKey: 'value',
      parser: (value: string, record: Options) => renderOptionsValue(value, record.type),
      icon: 'IconCode'
    },
    {
      title: t('options.fields.autoload', 'Autoload'),
      accessorKey: 'autoload',
      parser: (value: boolean) => (
        <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
      icon: 'IconRefresh'
    },
    {
      title: t('options.fields.created_at', 'Created'),
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
          onClick: (record: Options) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: Options) => handleView(record, 'edit')
        },
        {
          title: t('actions.duplicate', 'Duplicate'),
          icon: 'IconCopy',
          onClick: (record: Options) => {
            const duplicateRecord = {
              ...record,
              id: undefined,
              name: `${record.name}_copy`
            };
            handleView(duplicateRecord, 'create');
          }
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: Options) => handleDelete(record)
        }
      ]
    }
  ];
};

// Option type rendering helper
const renderOptionsType = (type: string) => {
  if (!type) return '-';

  const typeColors = {
    string: 'bg-blue-100 text-blue-800',
    number: 'bg-green-100 text-green-800',
    boolean: 'bg-purple-100 text-purple-800',
    object: 'bg-orange-100 text-orange-800',
    array: 'bg-pink-100 text-pink-800'
  };

  const typeIcons = {
    string: 'IconText',
    number: 'IconNumbers',
    boolean: 'IconToggleLeft',
    object: 'IconBraces',
    array: 'IconList'
  };

  const colorClass = typeColors[type] || 'bg-slate-100 text-slate-800';
  const iconName = typeIcons[type] || 'IconTag';

  return (
    <div className='flex items-center space-x-1'>
      <Icons name={iconName} className='w-3 h-3' />
      <Badge className={colorClass}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
    </div>
  );
};

// Option value rendering helper
const renderOptionsValue = (value: string, type: string) => {
  if (!value) return '-';

  let displayValue = value;
  let isComplex = false;

  if (['object', 'array'].includes(type)) {
    isComplex = true;
    displayValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
  } else if (type === 'boolean') {
    const boolValue = ['true', '1', 'yes'].includes(value.toLowerCase());
    return (
      <Badge className={boolValue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {boolValue ? 'True' : 'False'}
      </Badge>
    );
  } else {
    displayValue = value.length > 30 ? `${value.substring(0, 30)}...` : value;
  }

  return (
    <Tooltip content={value}>
      <div className='flex items-center space-x-1'>
        {isComplex && <Icons name='IconBraces' className='w-3 h-3 text-orange-500' />}
        <span className='text-slate-600 font-mono text-xs'>{displayValue}</span>
      </div>
    </Tooltip>
  );
};
