import React, { useState, useRef, useEffect, useMemo } from 'react';

import { cn } from '@ncobase/utils';

import { HierarchicalNode } from '../hooks/useHierarchicalData';
import { useHierarchicalSelect } from '../hooks/useHierarchicalSelect';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icon';

export interface HierarchicalSelectProps {
  // Data props
  options: HierarchicalNode[];
  value?: any | any[];
  defaultValue?: any | any[];
  onChange?: (_value: any) => void;

  // Display props
  placeholder?: string;
  prependIcon?: string;
  prependIconClick?: () => void;
  multiple?: boolean;
  allowParentSelection?: boolean;
  searchable?: boolean;

  // Styling
  className?: string;
  disabled?: boolean;
  error?: boolean;

  // Additional props
  [key: string]: any;
}

export const HierarchicalSelect = React.forwardRef<HTMLDivElement, HierarchicalSelectProps>(
  (
    {
      options = [],
      value,
      defaultValue = [],
      onChange,
      placeholder = 'Please select',
      prependIcon,
      prependIconClick,
      multiple = false,
      allowParentSelection = false,
      searchable = false,
      className,
      disabled = false,
      error = false,
      ...rest
    },
    ref
  ) => {
    // Initialize hierarchical selection
    const {
      selectedValues,
      filteredSelectedValues,
      nodesMap,
      toggleNodeSelection,
      toggleNodeExpansion,
      expandedNodes,
      getIndeterminateState,
      getVisibleNodes
    } = useHierarchicalSelect(options, value, defaultValue, onChange, {
      multiple,
      allowParentSelection
    });

    // Local state
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    // Focus search input when opening dropdown
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    }, [isOpen, searchable]);

    // Toggle dropdown
    const toggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen) {
          setSearchTerm('');
        }
      }
    };

    // Clear selection
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(multiple ? [] : null);
    };

    // Get visible nodes based on search and expanded state
    const visibleNodes = useMemo(() => {
      const nodes = getVisibleNodes(searchTerm);

      return nodes.sort((a, b) => {
        // First sort by level to keep hierarchy
        if ((a.level || 0) !== (b.level || 0)) {
          return (a.level || 0) - (b.level || 0);
        }
        // Then sort by label
        return String(a.label).localeCompare(String(b.label));
      });
    }, [getVisibleNodes, searchTerm, expandedNodes]);

    // Calculate if we should show all/collapse all buttons
    // const hasNestedNodes = useMemo(() => {
    //   return options.some(node => node.parent !== undefined && node.parent !== null);
    // }, [options]);

    // Render selected values
    const renderSelectedValues = () => {
      if (filteredSelectedValues.length === 0) {
        return <span className='text-slate-400'>{placeholder}</span>;
      }

      if (!multiple) {
        // Single selection mode
        const node = nodesMap[filteredSelectedValues[0]];
        return <span className='truncate'>{node ? node.label : filteredSelectedValues[0]}</span>;
      }

      // For multiple selection, show number if more than 2 items are selected
      if (filteredSelectedValues.length > 2) {
        return (
          <div className='flex flex-wrap gap-1 items-center'>
            {filteredSelectedValues.slice(0, 2).map(value => {
              const node = nodesMap[value];
              if (!node) return null;

              return (
                <div
                  key={value}
                  className='flex items-center bg-slate-100 rounded-md px-2 py-0.5 max-w-[150px]'
                >
                  <span className='truncate'>{node.label}</span>
                  <Button
                    variant='unstyle'
                    size='ratio'
                    className='ml-1 p-0.5 shrink-0'
                    onClick={e => {
                      e.stopPropagation();
                      toggleNodeSelection(value);
                    }}
                  >
                    <Icons name='IconX' className='w-3 h-3' />
                  </Button>
                </div>
              );
            })}
            <span className='text-xs px-1 bg-slate-200 rounded-md'>
              +{filteredSelectedValues.length - 2} more
            </span>
          </div>
        );
      }

      // Multiple selection mode - render as tags
      return (
        <div className='flex flex-wrap gap-1 items-center'>
          {filteredSelectedValues.map(value => {
            const node = nodesMap[value];
            if (!node) return null;

            return (
              <div
                key={value}
                className='flex items-center bg-slate-100 rounded-md px-2 py-0.5 max-w-[200px]'
              >
                <span className='truncate'>{node.label}</span>
                <Button
                  variant='unstyle'
                  size='ratio'
                  className='ml-1 p-0.5 shrink-0'
                  onClick={e => {
                    e.stopPropagation();
                    toggleNodeSelection(value);
                  }}
                >
                  <Icons name='IconX' className='w-3 h-3' />
                </Button>
              </div>
            );
          })}
        </div>
      );
    };

    // Render tree nodes
    const renderTreeNodes = () => {
      const render = (node: HierarchicalNode) => {
        const { value, label, level = 0 } = node;
        const isSelected = selectedValues.includes(value);
        const hasChildren = options.some(opt => opt.parent === value);
        const isExpanded = expandedNodes.has(value);
        const isIndeterminate = getIndeterminateState(value);

        // Determine if the node is selectable
        const isSelectable = allowParentSelection || !hasChildren;

        // Highlight search term if needed
        let displayLabel = label as React.ReactNode;
        if (searchTerm) {
          const index = String(label).toLowerCase().indexOf(searchTerm.toLowerCase());
          if (index >= 0) {
            displayLabel = (
              <>
                {String(label).substring(0, index)}
                <span className='bg-yellow-200'>
                  {String(label).substring(index, index + searchTerm.length)}
                </span>
                {String(label).substring(index + searchTerm.length)}
              </>
            );
          }
        }

        return (
          <React.Fragment key={value}>
            {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
            <div
              className={cn(
                'flex items-center px-3 py-2 transition-colors duration-150',
                isSelectable ? 'cursor-pointer' : 'cursor-default',
                'hover:bg-slate-50',
                isSelected ? 'bg-primary-50' : isIndeterminate ? 'bg-primary-50/30' : ''
              )}
              style={{ paddingLeft: `${level * 16 + 12}px` }}
              onClick={e => {
                e.stopPropagation();
                if (isSelectable) {
                  toggleNodeSelection(value);
                } else if (hasChildren) {
                  // If it's an unselectable parent node, clicking only toggles expand/collapse
                  toggleNodeExpansion(value, e);
                }
              }}
              role='option'
              aria-selected={isSelected}
            >
              {hasChildren ? (
                <Button
                  variant='unstyle'
                  size='ratio'
                  className='mr-2 p-0'
                  onClick={e => {
                    e.stopPropagation();
                    toggleNodeExpansion(value, e);
                  }}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <Icons
                    name={isExpanded ? 'IconChevronDown' : 'IconChevronRight'}
                    className='w-3.5 h-3.5'
                  />
                </Button>
              ) : (
                <div className='w-3.5 h-3.5 mr-2'></div>
              )}

              <div className='mr-2 shrink-0 relative inline-flex items-center'>
                <input
                  type='checkbox'
                  checked={isSelected}
                  disabled={!isSelectable}
                  className={cn(
                    'rounded-sm border-slate-300',
                    !isSelectable && 'opacity-60 cursor-not-allowed'
                  )}
                  aria-checked={isIndeterminate ? 'mixed' : isSelected}
                  onClick={e => {
                    e.stopPropagation();
                    if (isSelectable) {
                      toggleNodeSelection(value);
                    }
                  }}
                  readOnly={!isSelectable}
                />
                {isIndeterminate && (
                  <div className='absolute w-1.5 h-1.5 bg-primary-600 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>
                )}
              </div>
              <span className='truncate flex-1'>{displayLabel}</span>
            </div>

            {/* Render children if expanded */}
            {hasChildren &&
              isExpanded &&
              options
                .filter(child => child.parent === value)
                .sort((a, b) => String(a.label).localeCompare(String(b.label)))
                .map(child => render({ ...child, level: level + 1 }))}
          </React.Fragment>
        );
      };

      // Render root nodes first
      return visibleNodes.filter(node => !node.parent).map(render);
    };

    return (
      <div className={cn('relative', className)} ref={ref} {...rest}>
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
        <div
          className={cn(
            'flex flex-wrap items-center justify-between min-h-[38px] px-3 py-2 w-full bg-slate-50/55 hover:bg-slate-50/25 border border-slate-200/65',
            'shadow-[0.03125rem_0.03125rem_0.125rem_0_rgba(0,0,0,0.03)]',
            error ? 'border-danger-600' : 'focus-within:border-primary-600',
            'text-slate-500 rounded-md transition-colors gap-1.5 relative cursor-pointer',
            disabled && 'opacity-55 cursor-not-allowed pointer-events-none',
            prependIcon && 'pl-9!'
          )}
          onClick={toggleDropdown}
          ref={dropdownRef}
          // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
          role='combobox'
          aria-expanded={isOpen}
          aria-haspopup='listbox'
        >
          {prependIcon && (
            <Button
              className={cn(
                'absolute left-1 top-1/2 transform -translate-y-1/2 cursor-default outline-hidden',
                prependIconClick && 'cursor-pointer'
              )}
              onClick={e => {
                e.stopPropagation();
                prependIconClick?.();
              }}
              variant='unstyle'
              size='ratio'
              aria-hidden='true'
            >
              <Icons name={prependIcon} />
            </Button>
          )}

          <div className='flex-1 overflow-hidden'>{renderSelectedValues()}</div>

          <div className='flex items-center ml-auto shrink-0'>
            {selectedValues.length > 0 && (
              <Button
                className='mr-1 cursor-pointer outline-hidden'
                onClick={handleClear}
                variant='unstyle'
                size='ratio'
                aria-label='Clear selection'
              >
                <Icons name='IconX' className='w-3.5 h-3.5' />
              </Button>
            )}

            <Icons
              name='IconChevronDown'
              className={cn('transition-transform duration-200', isOpen && 'transform rotate-180')}
              aria-hidden='true'
            />
          </div>
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          // eslint-disable-next-line jsx-a11y/interactive-supports-focus
          <div
            className='absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-hidden'
            role='listbox'
            aria-multiselectable={multiple}
            onClick={e => {
              e.stopPropagation();
            }}
            onMouseDown={e => {
              e.stopPropagation();
            }}
          >
            <div className='sticky top-0 z-10 bg-white border-b border-slate-100'>
              {/* Search box */}
              {searchable && (
                <div className='p-2'>
                  <div className='relative'>
                    <Icons
                      name='IconSearch'
                      className='absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400'
                      size={16}
                      aria-hidden='true'
                    />
                    <input
                      type='text'
                      className='w-full px-9 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-primary-500'
                      placeholder='Search...'
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      ref={searchInputRef}
                      aria-label='Search options'
                    />
                    {searchTerm && (
                      <Button
                        variant='unstyle'
                        size='ratio'
                        className='absolute right-2 top-1/2 transform -translate-y-1/2'
                        onClick={e => {
                          e.stopPropagation();
                          setSearchTerm('');
                          searchInputRef.current?.focus();
                        }}
                        aria-label='Clear search'
                      >
                        <Icons name='IconX' className='w-3.5 h-3.5 text-slate-400' />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Expand/Collapse all buttons - only show if we have nested nodes */}
              {/* {hasNestedNodes && (
                <div className='flex items-center justify-between px-2 py-1 bg-slate-50 text-xs'>
                  <div className='flex space-x-2'>
                    <Button
                      variant='unstyle'
                      className='text-slate-600 hover:text-primary-600 text-xs flex items-center'
                      onClick={e => {
                        e.stopPropagation();
                        expandAllNodes();
                      }}
                    >
                      <Icons name='IconArrowsMaximize' className='w-3 h-3 mr-1' />
                      Expand all
                    </Button>
                    <Button
                      variant='unstyle'
                      className='text-slate-600 hover:text-primary-600 text-xs flex items-center'
                      onClick={e => {
                        e.stopPropagation();
                        collapseAllNodes();
                      }}
                    >
                      <Icons name='IconArrowsMinimize' className='w-3 h-3 mr-1' />
                      Collapse all
                    </Button>
                  </div>
                  <span className='text-slate-500'>
                    {selectedValues.length > 0 && `${selectedValues.length} selected`}
                  </span>
                </div>
              )} */}
            </div>

            {/* Empty state */}
            {visibleNodes.length === 0 && (
              <div className='p-3 text-center text-slate-500'>
                {searchTerm ? 'No matching options found' : 'No options available'}
              </div>
            )}

            {/* Tree nodes */}
            <div
              className='max-h-60 overflow-auto'
              onClick={e => {
                e.stopPropagation();
              }}
            >
              {renderTreeNodes()}
            </div>
          </div>
        )}
      </div>
    );
  }
);

HierarchicalSelect.displayName = 'HierarchicalSelect';
