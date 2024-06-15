import React from 'react';

import { Button, Icons, Input, Tooltip, TooltipContent, TooltipTrigger } from '@ncobase/react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/layout';
import { Topbar } from '@/layout';

export const Customer = () => {
  const navigate = useNavigate();
  const topbarElement = {
    title: 'Customer Page',
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
      <>
        <div>div element</div>
        <span> | </span>
      </>,
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant='unstyle' size='ratio'>
            Button
          </Button>
        </TooltipTrigger>
        <TooltipContent side='bottom'>Custom Action</TooltipContent>
      </Tooltip>,
      <Input placeholder='Input Element' className='px2.5 py-1 max-w-32' />,
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

  return <Page topbar={topbar}></Page>;
};
