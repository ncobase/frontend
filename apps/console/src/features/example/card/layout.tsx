import React from 'react';

import { Tooltip, TooltipTrigger, Icons, TooltipContent, Button } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Topbar, Page } from '@/layout';

export const CardTopbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const topbarElement = {
    title: t('example.card.title'),
    left: [
      <div className='rounded-md flex items-center justify-between gap-x-1'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='unstyle'
              size='ratio'
              className='border-0'
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
      </div>,
      <div className='bg-slate-100 p-1 rounded-md flex items-center justify-between gap-x-2'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='unstyle'
              size='ratio'
              className='p-1 hover:bg-white'
              onClick={() => navigate('/example/card')}
            >
              <Icons name='IconLayoutBoard' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Card Layout</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='unstyle'
              size='ratio'
              className='p-1 hover:bg-white'
              onClick={() => navigate('/example/list-2')}
            >
              <Icons name='IconTableColumn' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>List Layout</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='unstyle'
              size='ratio'
              className='p-1 hover:bg-white'
              onClick={() => navigate('/example/list-1')}
            >
              <Icons name='IconTable' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Card Layout</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='unstyle' size='ratio' className='p-1 hover:bg-white'>
              <Icons name='IconArrowsMaximize' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Full Screen</TooltipContent>
        </Tooltip>
      </div>
    ]
  };

  return <Topbar {...topbarElement} />;
};

export const CardLayout = ({ children, ...rest }) => {
  return (
    <Page sidebar topbar={<CardTopbar />} submenu {...rest}>
      {children}
    </Page>
  );
};
