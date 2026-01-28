import React from 'react';

import { cn } from '@ncobase/utils';

interface DividerProps {
  className?: string;
  dir?: 'horizontal' | 'vertical';
  label?: string;
  color?:
    | 'white'
    | 'black'
    | 'primary'
    | 'slate'
    | 'gray'
    | 'red'
    | 'orange'
    | 'amber'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'emerald'
    | 'teal'
    | 'cyan'
    | 'sky'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'purple'
    | 'fuchsia'
    | 'pink'
    | 'rose';
  style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
}

export const Divider: React.FC<DividerProps> = ({
  className,
  dir = 'horizontal',
  color = 'slate',
  style = 'solid',
  label
}) => {
  const dirStyle = dir === 'horizontal' ? 'border-t' : 'border-l';

  return (
    <div className={cn('relative flex py-5 items-center text-slate-400/65', className)}>
      <div className={cn('grow', dirStyle, `border-${color}-300/65`, `border-${style}`)}></div>
      {label && <div className={cn('shrink mx-3', `!text-${color}-400/65`)}>{label}</div>}
      <div className={cn('grow', dirStyle, `border-${color}-300/65`, `border-${style}`)}></div>
    </div>
  );
};
