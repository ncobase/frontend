import React from 'react';

import { Button, Icons, Tooltip, TooltipContent, TooltipTrigger } from '@ncobase/react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/layout';
import { Topbar } from '@/layout';

export const Sale = () => {
  const navigate = useNavigate();
  const topbarElement = {
    title: 'Sale Page',
    left: [
      <div className='rounded-md flex items-center justify-between gap-x-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='unstyle'
              size='ratio'
              onClick={() => navigate('/example/ui/form/create')}
            >
              <Icons name='IconPlus' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Create</TooltipContent>
        </Tooltip>
      </div>
    ],
    right: [
      <div className='rounded-md flex items-center justify-between gap-x-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='unstyle' size='ratio'>
              <Icons name='IconFilter' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Filter</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='unstyle' size='ratio'>
              <Icons name='IconColumns' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Customized columns</TooltipContent>
        </Tooltip>
      </div>
    ]
  };

  const topbar = <Topbar {...topbarElement} />;

  return <Page title={topbarElement.title} topbar={topbar}></Page>;
};
