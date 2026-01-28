import React, { ReactNode, useState } from 'react';

import { cn } from '@ncobase/utils';

import { Icons } from '@/components/ui/icon';

export interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
  icon?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  children,
  collapsible = false,
  defaultCollapsed = false,
  className,
  titleClassName,
  subtitleClassName,
  contentClassName,
  icon
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const handleToggle = () => {
    if (collapsible) {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div
      className={cn(
        'border rounded-lg transition-colors duration-200',
        'border-slate-100 dark:border-slate-700',
        'hover:border-slate-200 dark:hover:border-slate-600',
        'hover:shadow',
        className
      )}
    >
      <div
        className={cn(
          'px-4 py-3 flex items-center justify-between rounded-t-lg',
          'bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800',
          'transition-colors duration-200',
          collapsible && 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700'
        )}
        onClick={handleToggle}
      >
        <div className='flex items-center space-x-3'>
          {icon && (
            <Icons
              name={icon}
              className='w-5 h-5 text-slate-500 dark:text-slate-400 transition-colors'
            />
          )}
          <div>
            <div
              className={cn(
                'font-semibold text-slate-800 dark:text-slate-100',
                'transition-colors duration-200',
                titleClassName
              )}
            >
              {title}
            </div>
            {subtitle && (
              <p
                className={cn(
                  'text-xs text-slate-500 dark:text-slate-400',
                  'transition-colors duration-200 mt-0.5',
                  subtitleClassName
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {collapsible && (
          <Icons
            name={collapsed ? 'IconChevronDown' : 'IconChevronUp'}
            className={cn(
              'w-5 h-5 text-slate-400 dark:text-slate-500',
              'transition-all duration-200',
              'hover:text-slate-600 dark:hover:text-slate-300',
              collapsed && 'transform rotate-0',
              !collapsed && 'transform rotate-180'
            )}
          />
        )}
      </div>
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          'bg-white dark:bg-slate-900',
          collapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100',
          'px-4 py-3 rounded-b-lg',
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};
