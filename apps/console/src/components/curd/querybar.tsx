import { useState, useEffect } from 'react';

import { Button, Form, Icons } from '@ncobase/react';
import { TFunction } from 'i18next';

export const QueryBar = ({
  queryFields = [],
  onQuery,
  onResetQuery,
  t
}: {
  queryFields: {
    name: string;
    label: string;
    component: React.ReactNode;
  }[];
  onQuery?: (_query: any) => void;
  onResetQuery?: () => void;
  t?: TFunction;
}) => {
  // State to manage expanded/collapsed state
  const [isExpanded, setIsExpanded] = useState(queryFields.length <= 3);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  // Track window size for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!queryFields.length) return null;

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  // Determine which fields to display based on expanded state
  const visibleFields = isExpanded
    ? queryFields
    : queryFields.slice(0, Math.min(3, queryFields.length));

  // Determine if the screen is mobile
  const isMobile = windowWidth < 768;

  return (
    <Form
      id='querybar-form'
      onSubmit={onQuery}
      noValidate
      className='flex bg-white shadow-xs -mx-4 -mt-4 p-4 relative'
    >
      <div
        className='flex-1 w-full'
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '1rem'
        }}
      >
        {/* Query fields area */}
        <div style={{ flex: isMobile ? '1 0 auto' : '11' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${
                isMobile
                  ? 1
                  : queryFields.length === 1
                    ? 1
                    : queryFields.length === 2 || windowWidth < 1024
                      ? 2
                      : queryFields.length >= 3 && windowWidth >= 1024
                        ? 3
                        : 2
              }, 1fr)`,
              gap: '1rem'
            }}
          >
            {visibleFields.map(({ name, label, component }) => (
              <div key={name} className='flex items-center'>
                <div className='text-slate-800 whitespace-nowrap'>{label}：</div>
                <div className='flex-1 pl-2'>{component}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div
          style={{
            flex: isMobile ? '1 0 auto' : '1',
            display: 'flex',
            flexDirection: isExpanded && queryFields.length > 3 ? 'column' : 'row',
            justifyContent: isMobile ? 'flex-start' : 'flex-end',
            alignItems: 'center',
            gap: '1rem',
            minWidth: 'fit-content',
            minHeight: 'fit-content'
          }}
        >
          <Button type='submit' onClick={onQuery}>
            {t('query.search')}
          </Button>
          <Button variant='outline-slate' onClick={onResetQuery}>
            {t('query.reset')}
          </Button>
        </div>
      </div>

      {/* Expand/Collapse button */}
      {queryFields.length > 3 ? (
        <Button
          variant='unstyle'
          size='ratio'
          className='absolute -bottom-2 left-1/2 -translate-x-1/2 z-10 bg-white hover:bg-slate-50 [&>svg]:stroke-slate-500 [&>svg]:hover:stroke-slate-600 shadow-[0_1px_3px_0_rgba(0,0,0,0.10)] rounded-full p-0.5 border border-transparent'
          title={t(isExpanded ? 'query.collapse' : 'query.expand')}
          onClick={toggleExpand}
        >
          <Icons name={isExpanded ? 'IconChevronUp' : 'IconChevronDown'} size={12} />
        </Button>
      ) : null}
    </Form>
  );
};
