import React, { useState, useEffect } from 'react';

import { useTable } from '../table.context';

import { Button } from '@/components/ui/button';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/forms';
import { Icons } from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type FilterOperator =
  | 'contains'
  | 'equals'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'between'
  | 'in';

export interface FilterCondition {
  column: string;
  operator: FilterOperator;
  value: any;
  valueEnd?: any; // For 'between' operator
}

interface ColumnFilterProps {
  column: string;
  texts?: {
    filterTitle?: string;
    activeFilters?: string;
    addFilter?: string;
    clearAll?: string;
    apply?: string;
    contains?: string;
    equals?: string;
    startsWith?: string;
    endsWith?: string;
    greaterThan?: string;
    lessThan?: string;
    between?: string;
    inList?: string;
    value?: string;
    endValue?: string;
    add?: string;
  };
}

const defaultTexts = {
  filterTitle: 'Filter',
  activeFilters: 'Active Filters',
  addFilter: 'Add Filter',
  clearAll: 'Clear All',
  apply: 'Apply Filters',
  contains: 'Contains',
  equals: 'Equals',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
  greaterThan: 'Greater Than',
  lessThan: 'Less Than',
  between: 'Between',
  inList: 'In List',
  value: 'Value',
  endValue: 'End Value',
  add: 'Add'
};

export const ColumnFilter: React.FC<ColumnFilterProps> = ({ column, texts: customTexts = {} }) => {
  const { filter, setFilter } = useTable();
  const [conditions, setConditions] = useState<FilterCondition[]>([]);
  const [newCondition, setNewCondition] = useState<FilterCondition>({
    column,
    operator: 'contains',
    value: ''
  });
  const [open, setOpen] = useState(false);

  // Merge default texts with custom texts for i18n support
  const texts = { ...defaultTexts, ...customTexts };

  // Sync with filter state on mount and when column changes
  useEffect(() => {
    if (filter?.config?.[column]?.advancedFilters) {
      setConditions(filter.config[column].advancedFilters as FilterCondition[]);
    } else {
      setConditions([]);
    }
  }, [column, filter?.config]);

  const operatorOptions = [
    { label: texts.contains, value: 'contains' },
    { label: texts.equals, value: 'equals' },
    { label: texts.startsWith, value: 'startsWith' },
    { label: texts.endsWith, value: 'endsWith' },
    { label: texts.greaterThan, value: 'greaterThan' },
    { label: texts.lessThan, value: 'lessThan' },
    { label: texts.between, value: 'between' },
    { label: texts.inList, value: 'in' }
  ];

  const handleAddCondition = () => {
    if (!newCondition.value) return;

    const updatedConditions = [...conditions, newCondition];
    setConditions(updatedConditions);

    // Reset new condition for next input
    setNewCondition({
      column,
      operator: 'contains',
      value: ''
    });

    // Apply the updated conditions
    applyFilters(updatedConditions);
  };

  const handleRemoveCondition = (index: number) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1);
    setConditions(updatedConditions);

    // Apply the updated conditions
    applyFilters(updatedConditions);
  };

  const applyFilters = (filtersToApply: FilterCondition[] = conditions) => {
    // Set filter in table context
    if (setFilter) {
      setFilter(prev => ({
        ...prev,
        config: {
          ...(prev?.config || {}),
          [column]: {
            ...(prev?.config?.[column] || {}),
            advancedFilters: filtersToApply,
            enabled: filtersToApply.length > 0
          }
        }
      }));
    }
    // Close the popover when applying filters
    if (filtersToApply.length > 0) {
      setOpen(false);
    }
  };

  const clearFilters = () => {
    setConditions([]);
    applyFilters([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='unstyle'
          size='sm'
          className={`h-8 w-8 p-0 ${conditions.length > 0 ? 'text-blue-500' : ''}`}
        >
          <Icons
            name='IconFilter'
            className={`h-3.5 w-3.5 ${conditions.length > 0 ? 'fill-blue-200' : ''}`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='z-999 w-80 bg-white' align='center' sideOffset={5} alignOffset={0}>
        <div className='space-y-4'>
          <h4 className='font-medium'>
            {texts.filterTitle} {column}
          </h4>

          {/* Active filters */}
          {conditions.length > 0 && (
            <div className='space-y-2'>
              <h5 className='font-medium'>{texts.activeFilters}</h5>
              {conditions.map((condition, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded bg-slate-50 p-2'
                >
                  <span>
                    {operatorOptions.find(op => op.value === condition.operator)?.label ||
                      condition.operator}{' '}
                    {condition.value}
                    {condition.valueEnd ? ` to ${condition.valueEnd}` : ''}
                  </span>
                  <Button
                    variant='unstyle'
                    size='sm'
                    className='h-6 w-6 p-0'
                    onClick={() => handleRemoveCondition(index)}
                  >
                    <Icons name='IconX' className='h-3 w-3' />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add new condition */}
          <div className='space-y-2'>
            <h5 className='font-medium'>{texts.addFilter}</h5>
            <div className='grid grid-cols-1 gap-2'>
              <Select
                value={newCondition.operator}
                onValueChange={val =>
                  setNewCondition({ ...newCondition, operator: val as FilterOperator })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select operator' />
                </SelectTrigger>
                <SelectContent>
                  {operatorOptions.map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className='flex space-x-2'>
                <Input
                  placeholder={texts.value}
                  value={newCondition.value || ''}
                  onChange={e => setNewCondition({ ...newCondition, value: e.target.value })}
                  className='flex-1'
                />

                {newCondition.operator === 'between' && (
                  <Input
                    placeholder={texts.endValue}
                    value={newCondition.valueEnd || ''}
                    onChange={e => setNewCondition({ ...newCondition, valueEnd: e.target.value })}
                    className='flex-1'
                  />
                )}

                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleAddCondition}
                  disabled={!newCondition.value}
                >
                  {texts.add}
                </Button>
              </div>
            </div>
          </div>

          <div className='flex justify-between'>
            <Button
              variant='outline'
              size='sm'
              onClick={clearFilters}
              disabled={conditions.length === 0}
            >
              {texts.clearAll}
            </Button>
            <Button size='sm' onClick={() => applyFilters()} disabled={conditions.length === 0}>
              {texts.apply}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
