import { Button, TableViewProps, Badge, Tooltip, Icons } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Option } from '../option';

export const tableColumns = ({
  handleView,
  handleDelete,
  handleDuplicate
}): TableViewProps['header'] => {
  const { t } = useTranslation();

  return [
    {
      title: t('option.fields.name', 'Name'),
      dataIndex: 'name',
      parser: (value: string, record: Option) => (
        <div className='flex flex-col'>
          <Button
            variant='link'
            size='md'
            onClick={() => handleView(record, 'view')}
            className='justify-start p-0 h-auto'
          >
            <span className='font-medium font-mono text-sm text-blue-600'>{value}</span>
          </Button>
          {record.id && <span className='text-xs text-gray-400 mt-1'>ID: {record.id}</span>}
        </div>
      ),
      icon: 'IconKey'
    },
    {
      title: t('option.fields.type', 'Type'),
      dataIndex: 'type',
      parser: (value: string) => renderOptionType(value),
      icon: 'IconTag'
    },
    {
      title: t('option.fields.value', 'Value'),
      dataIndex: 'value',
      parser: (value: string, record: Option) => renderOptionValue(value, record.type),
      icon: 'IconCode'
    },
    {
      title: t('option.fields.autoload', 'Auto Load'),
      dataIndex: 'autoload',
      parser: (value: boolean) => (
        <Badge className={value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          <Icons name={value ? 'IconCheck' : 'IconX'} className='w-3 h-3 mr-1' />
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
      icon: 'IconRefresh'
    },
    {
      title: t('option.fields.created_at', 'Created'),
      dataIndex: 'created_at',
      parser: (value: string) => (
        <Tooltip content={formatDateTime(value, 'dateTime')}>
          <div className='text-sm'>
            <div>{formatRelativeTime(new Date(value))}</div>
            <div className='text-xs text-gray-400'>{formatDateTime(value, 'date')}</div>
          </div>
        </Tooltip>
      ),
      icon: 'IconCalendarPlus'
    },
    {
      title: t('common.actions', 'Actions'),
      dataIndex: 'operation-column',
      actions: [
        {
          title: t('actions.view', 'View'),
          icon: 'IconEye',
          onClick: (record: Option) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: Option) => handleView(record, 'edit')
        },
        {
          title: t('actions.duplicate', 'Duplicate'),
          icon: 'IconCopy',
          onClick: (record: Option) => handleDuplicate(record)
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: Option) => handleDelete(record)
        }
      ]
    }
  ];
};

// Type rendering helper
const renderOptionType = (type: string) => {
  if (!type) return '-';

  const typeConfig = {
    string: { color: 'bg-blue-100 text-blue-800', icon: 'IconLetterCase' },
    number: { color: 'bg-green-100 text-green-800', icon: 'IconNumbers' },
    boolean: { color: 'bg-purple-100 text-purple-800', icon: 'IconToggleLeft' },
    object: { color: 'bg-orange-100 text-orange-800', icon: 'IconBraces' },
    array: { color: 'bg-pink-100 text-pink-800', icon: 'IconBrackets' }
  };

  const config = typeConfig[type] || {
    color: 'bg-slate-100 text-slate-800'
  };

  return (
    <div className='flex items-center space-x-2'>
      <Badge className={config.color}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
    </div>
  );
};

// Value rendering helper
const renderOptionValue = (value: string, type: string) => {
  if (!value) return <span className='text-gray-400 italic'>No value</span>;

  let displayValue = value;
  let isComplex = false;
  let isValid = true;

  if (['object', 'array'].includes(type)) {
    isComplex = true;
    try {
      JSON.parse(value);
      displayValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
    } catch {
      isValid = false;
      displayValue = 'Invalid JSON';
    }
  } else if (type === 'boolean') {
    const boolValue = ['true', '1', 'yes'].includes(value.toLowerCase());
    return (
      <Badge className={boolValue ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        <Icons name={boolValue ? 'IconCheck' : 'IconX'} className='w-3 h-3 mr-1' />
        {boolValue ? 'True' : 'False'}
      </Badge>
    );
  } else if (type === 'number') {
    if (isNaN(Number(value))) {
      isValid = false;
      displayValue = 'Invalid Number';
    } else {
      displayValue = value.length > 30 ? `${value.substring(0, 30)}...` : value;
    }
  } else {
    displayValue = value.length > 30 ? `${value.substring(0, 30)}...` : value;
  }

  return (
    <Tooltip content={value}>
      <div className={`flex items-center space-x-2 ${!isValid ? 'text-red-600' : ''}`}>
        {isComplex && (
          <Icons
            name='IconBraces'
            className={`w-3 h-3 ${isValid ? 'text-orange-500' : 'text-red-500'}`}
          />
        )}
        {!isValid && <Icons name='IconAlertTriangle' className='w-3 h-3 text-red-500' />}
        <span className='text-slate-600 font-mono text-xs'>{displayValue}</span>
      </div>
    </Tooltip>
  );
};
