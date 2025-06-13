import React from 'react';

import { Container } from '@ncobase/react';
import { cn } from '@ncobase/utils';

import { TopbarProps } from '@/components/layout';

export interface FormTopbarProps extends TopbarProps {}

const FormTopbarWrapper: React.FC<FormTopbarProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'h-16 shadow-xs bg-white dark:bg-gray-800 sticky top-0 right-0 left-0 flex items-center',
        className
      )}
    >
      <Container className='max-w-7xl'>
        <div className='flex items-center justify-between'>{children}</div>
      </Container>
    </div>
  );
};

export const FormTopbar: React.FC<FormTopbarProps> = ({
  title,
  left = [],
  right = [],
  children,
  className
}) => {
  if (children) {
    return <FormTopbarWrapper className={className}>{children}</FormTopbarWrapper>;
  }
  return (
    <FormTopbarWrapper className={className}>
      <div
        className={cn(
          'flex-1 flex items-center gap-x-4',
          left.length > 2 && 'flex-row-reverse justify-end'
        )}
      >
        {left.length > 0 && (
          <div className='flex gap-2'>
            {left.map((element, index) => (
              <React.Fragment key={index}>{element}</React.Fragment>
            ))}
          </div>
        )}
        {title && (
          <div className='flex font-medium text-slate-600 dark:text-slate-300'>{title}</div>
        )}
      </div>
      {right.length > 0 && (
        <div className='grow flex justify-end items-center gap-2'>
          {right.map((element, index) => (
            <React.Fragment key={index}>{element}</React.Fragment>
          ))}
        </div>
      )}
    </FormTopbarWrapper>
  );
};
