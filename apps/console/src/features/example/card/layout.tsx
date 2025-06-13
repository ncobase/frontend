import { Button, Icons, Tooltip } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Page, Topbar } from '@/components/layout';

export const CardTopbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const topbarElement = {
    title: t('example.card.title'),
    left: [
      <div className='rounded-md flex items-center justify-between gap-x-1'>
        <Tooltip side='bottom' content='Create'>
          <Button
            variant='unstyle'
            size='ratio'
            className='border-0'
            onClick={() => navigate('/example/ui/form/create')}
          >
            <Icons name='IconPlus' />
          </Button>
        </Tooltip>
      </div>
    ],
    right: [
      <div className='rounded-md flex items-center justify-between gap-x-1 dark:bg-gray-800'>
        <Tooltip side='bottom' content='Filter'>
          <Button variant='unstyle' size='ratio'>
            <Icons name='IconFilter' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='Customized columns'>
          <Button variant='unstyle' size='ratio'>
            <Icons name='IconColumns' />
          </Button>
        </Tooltip>
      </div>,
      <div className='bg-slate-100 dark:bg-gray-800 p-1 rounded-md flex items-center justify-between gap-x-2'>
        <Tooltip side='bottom' content='Card Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white dark:hover:bg-gray-700'
            onClick={() => navigate('/example/card')}
          >
            <Icons name='IconLayoutBoard' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='List Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white dark:hover:bg-gray-700'
            onClick={() => navigate('/example/list-2')}
          >
            <Icons name='IconTableColumn' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='Card Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white dark:hover:bg-gray-700'
            onClick={() => navigate('/example/list-1')}
          >
            <Icons name='IconTable' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='Full Screen'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white dark:hover:bg-gray-700'
          >
            <Icons name='IconArrowsMaximize' />
          </Button>
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
