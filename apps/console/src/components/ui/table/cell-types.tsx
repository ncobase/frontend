import React from 'react';

import { cn } from '@ncobase/utils';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

// Define proper interfaces for props
interface CellTypesBaseProps {
  value: any;
  record?: Record<string, any>;
}

interface BadgeCellProps extends CellTypesBaseProps {
  options?: {
    variants?: Record<string, string>;
    defaultVariant?: string;
  };
}

interface ProgressCellProps extends CellTypesBaseProps {
  options?: {
    max?: number;
    color?: string;
  };
}

interface BooleanCellProps extends CellTypesBaseProps {
  options?: {
    type?: 'checkbox' | 'toggle';
  };
}

interface ImageCellProps extends CellTypesBaseProps {
  options?: {
    width?: number;
    height?: number;
    rounded?: boolean;
  };
}

interface AvatarWithTextCellProps extends CellTypesBaseProps {
  options: {
    imageKey: string;
    nameKey: string;
    descriptionKey?: string;
  };
}

interface DateTimeCellProps extends CellTypesBaseProps {
  options?: {
    format?: 'full' | 'date' | 'time' | 'relative';
  };
}

interface CurrencyCellProps extends CellTypesBaseProps {
  options?: {
    currency?: string;
    locale?: string;
  };
}

interface CustomCellProps extends CellTypesBaseProps {
  options: {
    render: (_value: any, _record?: Record<string, any>) => React.ReactNode;
  };
}

// Define the CellTypes object with properly typed components
export const CellTypes = {
  // Badge cell type with customizable colors
  Badge: ({ value, options = {} }: BadgeCellProps) => {
    const { variants = {}, defaultVariant = 'default' } = options;
    const variant = variants[value] || defaultVariant;

    return <Badge variant={variant as BadgeProps['variant']}>{value}</Badge>;
  },

  // Progress bar cell type
  Progress: ({ value, options = {} }: ProgressCellProps) => {
    const { max = 100, color = 'blue' } = options;
    const percentage = (value / max) * 100;

    return (
      <div className='w-full'>
        <Progress
          value={percentage}
          className={`bg-${color}-100`}
          // indicatorClassName={`bg-${color}-500`}
        />
        <div className='text-xs text-center mt-1'>
          {value}/{max}
        </div>
      </div>
    );
  },

  // Boolean cell type (checkbox or toggle)
  Boolean: ({ value, options = {} }: BooleanCellProps) => {
    const { type = 'checkbox' } = options;

    if (type === 'checkbox') {
      return (
        <div className='flex justify-center'>
          {value ? (
            <Icons name='IconCheck' className='text-green-500' />
          ) : (
            <Icons name='IconX' className='text-red-500' />
          )}
        </div>
      );
    }

    return (
      <div className={cn('w-10 h-5 rounded-full relative', value ? 'bg-blue-500' : 'bg-gray-300')}>
        <div
          className={cn(
            'absolute w-4 h-4 rounded-full bg-white top-0.5 transition-all',
            value ? 'left-5' : 'left-0.5'
          )}
        />
      </div>
    );
  },

  // Image cell type
  Image: ({ value, options = {} }: ImageCellProps) => {
    const { width = 40, height = 40, rounded = true } = options;

    return (
      // eslint-disable-next-line jsx-a11y/img-redundant-alt
      <img
        src={value}
        alt='Cell image'
        style={{ width, height }}
        className={cn(rounded && 'rounded-full')}
      />
    );
  },

  // Avatar with text
  AvatarWithText: ({ value, options }: AvatarWithTextCellProps) => {
    const { imageKey, nameKey, descriptionKey } = options;
    const image = value[imageKey];
    const name = value[nameKey];
    const description = descriptionKey ? value[descriptionKey] : undefined;

    return (
      <div className='flex items-center gap-3'>
        <Avatar>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className='font-medium'>{name}</div>
          {description && <div className='text-gray-500'>{description}</div>}
        </div>
      </div>
    );
  },

  // Date/Time formatting
  DateTime: ({ value, options = {} }: DateTimeCellProps) => {
    const { format = 'full' } = options;
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return <span>Invalid date</span>;
    }

    switch (format) {
      case 'date':
        return <span>{date.toLocaleDateString()}</span>;
      case 'time':
        return <span>{date.toLocaleTimeString()}</span>;
      case 'relative': {
        // Simple relative time logic
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return <span>Just now</span>;
        if (diffMins < 60) return <span>{diffMins} min ago</span>;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return <span>{diffHours} hours ago</span>;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 30) return <span>{diffDays} days ago</span>;

        return <span>{date.toLocaleDateString()}</span>;
      }
      default:
        return <span>{date.toLocaleString()}</span>;
    }
  },

  // Currency formatting
  Currency: ({ value, options = {} }: CurrencyCellProps) => {
    const { currency = 'USD', locale = 'en-US' } = options;

    return (
      <span>
        {new Intl.NumberFormat(locale, {
          style: 'currency',
          currency
        }).format(value)}
      </span>
    );
  },

  // Custom cell renderer that accepts a render function
  Custom: ({ value, record, options }: CustomCellProps) => {
    const { render } = options;

    if (typeof render === 'function') {
      return render(value, record);
    }

    return <span>{value}</span>;
  }
};
