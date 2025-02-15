import { useState } from 'react';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  DatePicker,
  Icons,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableView,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Uploader
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Page, Topbar } from '@/layout';

export const UITopbar = ({ ...rest }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const topbarElement = {
    title: t('example.ui.title'),
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

  return <Topbar {...topbarElement} {...rest} />;
};

export const Elements = ({ ...rest }) => {
  const handleDateSelect = date => {
    console.log(date);
  };

  const handleDateRangeSelect = range => {
    console.log(range);
  };

  const [files, setFiles] = useState<File[] | null>([]);

  const handleValueChange = value => {
    setFiles(value);
  };

  return (
    <Page sidebar {...rest} topbar={<UITopbar />}>
      <div className='grid grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='p-4 border-b border-slate-100'>
            <CardTitle className='text-lg font-normal'>Button</CardTitle>
          </CardHeader>
          <CardContent className='flex-col p-4 max-h-72 overflow-auto'>
            <div className='flex gap-4 justify-between'>
              <div className='grid grid-cols-1 gap-4 pb-4'>
                <div className='flex items-center text-slate-800 text-lg'>Default size:</div>
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='primary'>Primary</Button>
                  <Button variant='outline-primary'>Primary</Button>
                  <Button variant='secondary'>Secondary</Button>
                  <Button variant='outline-secondary'>Secondary</Button>
                  <Button variant='success'>Success</Button>
                  <Button variant='outline-success'>Success</Button>
                  <Button variant='warning'>Warning</Button>
                  <Button variant='outline-warning'>Warning</Button>
                  <Button variant='danger'>Danger</Button>
                  <Button variant='outline-danger'>Danger</Button>
                  <Button variant='slate'>Slate</Button>
                  <Button variant='outline-slate'>Slate</Button>
                  <Button variant='blue'>Blue</Button>
                  <Button variant='outline-blue'>Blue</Button>
                  <Button variant='indigo'>Indigo</Button>
                  <Button variant='outline-indigo'>Indigo</Button>
                  <Button variant='purple'>Purple</Button>
                  <Button variant='outline-purple'>Purple</Button>
                  <Button variant='pink'>Pink</Button>
                  <Button variant='outline-pink'>Pink</Button>
                  <Button variant='rose'>Rose</Button>
                  <Button variant='outline-rose'>Rose</Button>
                  <Button variant='orange'>Orange</Button>
                  <Button variant='outline-orange'>Orange</Button>
                  <Button variant='yellow'>Yellow</Button>
                  <Button variant='outline-yellow'>Yellow</Button>
                  <Button variant='green'>Green</Button>
                  <Button variant='outline-green'>Green</Button>
                  <Button variant='teal'>Teal</Button>
                  <Button variant='outline-teal'>Teal</Button>
                  <Button variant='cyan'>Cyan</Button>
                  <Button variant='outline-cyan'>Cyan</Button>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-4 pb-4'>
                <div className='flex items-center text-slate-800 text-lg'>
                  Default size with disabled:
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='primary' disabled>
                    Primary
                  </Button>
                  <Button variant='outline-primary' disabled>
                    Primary
                  </Button>
                  <Button variant='secondary' disabled>
                    Secondary
                  </Button>
                  <Button variant='outline-secondary' disabled>
                    Secondary
                  </Button>
                  <Button variant='success' disabled>
                    Success
                  </Button>
                  <Button variant='outline-success' disabled>
                    Success
                  </Button>
                  <Button variant='warning' disabled>
                    Warning
                  </Button>
                  <Button variant='outline-warning' disabled>
                    Warning
                  </Button>
                  <Button variant='danger' disabled>
                    Danger
                  </Button>
                  <Button variant='outline-danger' disabled>
                    Danger
                  </Button>
                  <Button variant='slate' disabled>
                    Slate
                  </Button>
                  <Button variant='outline-slate' disabled>
                    Slate
                  </Button>
                  <Button variant='blue' disabled>
                    Blue
                  </Button>
                  <Button variant='outline-blue' disabled>
                    Blue
                  </Button>
                  <Button variant='indigo' disabled>
                    Indigo
                  </Button>
                  <Button variant='outline-indigo' disabled>
                    Indigo
                  </Button>
                  <Button variant='purple' disabled>
                    Purple
                  </Button>
                  <Button variant='outline-purple' disabled>
                    Purple
                  </Button>
                  <Button variant='pink' disabled>
                    Pink
                  </Button>
                  <Button variant='outline-pink' disabled>
                    Pink
                  </Button>
                  <Button variant='rose' disabled>
                    Rose
                  </Button>
                  <Button variant='outline-rose' disabled>
                    Rose
                  </Button>
                  <Button variant='orange' disabled>
                    Orange
                  </Button>
                  <Button variant='outline-orange' disabled>
                    Orange
                  </Button>
                  <Button variant='yellow' disabled>
                    Yellow
                  </Button>
                  <Button variant='outline-yellow' disabled>
                    Yellow
                  </Button>
                  <Button variant='green' disabled>
                    Green
                  </Button>
                  <Button variant='outline-green' disabled>
                    Green
                  </Button>
                  <Button variant='teal' disabled>
                    Teal
                  </Button>
                  <Button variant='outline-teal' disabled>
                    Teal
                  </Button>
                  <Button variant='cyan' disabled>
                    Cyan
                  </Button>
                  <Button variant='outline-cyan' disabled>
                    Cyan
                  </Button>
                </div>
              </div>
            </div>
            <div className='flex gap-4 justify-between'>
              <div className='grid grid-cols-1 gap-4 pb-4'>
                <div className='flex items-center text-slate-800 text-lg'>Extra Small size:</div>
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='primary' size='xs'>
                    Primary
                  </Button>
                  <Button variant='outline-primary' size='xs'>
                    Primary
                  </Button>
                  <Button variant='secondary' size='xs'>
                    Secondary
                  </Button>
                  <Button variant='outline-secondary' size='xs'>
                    Secondary
                  </Button>
                  <Button variant='success' size='xs'>
                    Success
                  </Button>
                  <Button variant='outline-success' size='xs'>
                    Success
                  </Button>
                  <Button variant='warning' size='xs'>
                    Warning
                  </Button>
                  <Button variant='outline-warning' size='xs'>
                    Warning
                  </Button>
                  <Button variant='danger' size='xs'>
                    Danger
                  </Button>
                  <Button variant='outline-danger' size='xs'>
                    Danger
                  </Button>
                  <Button variant='slate' size='xs'>
                    Slate
                  </Button>
                  <Button variant='outline-slate' size='xs'>
                    Slate
                  </Button>
                  <Button variant='blue' size='xs'>
                    Blue
                  </Button>
                  <Button variant='outline-blue' size='xs'>
                    Blue
                  </Button>
                  <Button variant='indigo' size='xs'>
                    Indigo
                  </Button>
                  <Button variant='outline-indigo' size='xs'>
                    Indigo
                  </Button>
                  <Button variant='purple' size='xs'>
                    Purple
                  </Button>
                  <Button variant='outline-purple' size='xs'>
                    Purple
                  </Button>
                  <Button variant='pink' size='xs'>
                    Pink
                  </Button>
                  <Button variant='outline-pink' size='xs'>
                    Pink
                  </Button>
                  <Button variant='rose' size='xs'>
                    Rose
                  </Button>
                  <Button variant='outline-rose' size='xs'>
                    Rose
                  </Button>
                  <Button variant='orange' size='xs'>
                    Orange
                  </Button>
                  <Button variant='outline-orange' size='xs'>
                    Orange
                  </Button>
                  <Button variant='yellow' size='xs'>
                    Yellow
                  </Button>
                  <Button variant='outline-yellow' size='xs'>
                    Yellow
                  </Button>
                  <Button variant='green' size='xs'>
                    Green
                  </Button>
                  <Button variant='outline-green' size='xs'>
                    Green
                  </Button>
                  <Button variant='teal' size='xs'>
                    Teal
                  </Button>
                  <Button variant='outline-teal' size='xs'>
                    Teal
                  </Button>
                  <Button variant='cyan' size='xs'>
                    Cyan
                  </Button>
                  <Button variant='outline-cyan' size='xs'>
                    Cyan
                  </Button>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 pb-4'>
                <div className='flex items-center text-slate-800 text-lg'>
                  Extra Small size with disabled:
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='primary' size='xs' disabled>
                    Primary
                  </Button>
                  <Button variant='outline-primary' size='xs' disabled>
                    Primary
                  </Button>
                  <Button variant='secondary' size='xs' disabled>
                    Secondary
                  </Button>
                  <Button variant='outline-secondary' size='xs' disabled>
                    Secondary
                  </Button>
                  <Button variant='success' size='xs' disabled>
                    Success
                  </Button>
                  <Button variant='outline-success' size='xs' disabled>
                    Success
                  </Button>
                  <Button variant='warning' size='xs' disabled>
                    Warning
                  </Button>
                  <Button variant='outline-warning' size='xs' disabled>
                    Warning
                  </Button>
                  <Button variant='danger' size='xs' disabled>
                    Danger
                  </Button>
                  <Button variant='outline-danger' size='xs' disabled>
                    Danger
                  </Button>
                  <Button variant='slate' size='xs' disabled>
                    Slate
                  </Button>
                  <Button variant='outline-slate' size='xs' disabled>
                    Slate
                  </Button>
                  <Button variant='blue' size='xs' disabled>
                    Blue
                  </Button>
                  <Button variant='outline-blue' size='xs' disabled>
                    Blue
                  </Button>
                  <Button variant='indigo' size='xs' disabled>
                    Indigo
                  </Button>
                  <Button variant='outline-indigo' size='xs' disabled>
                    Indigo
                  </Button>
                  <Button variant='purple' size='xs' disabled>
                    Purple
                  </Button>
                  <Button variant='outline-purple' size='xs' disabled>
                    Purple
                  </Button>
                  <Button variant='pink' size='xs' disabled>
                    Pink
                  </Button>
                  <Button variant='outline-pink' size='xs' disabled>
                    Pink
                  </Button>
                  <Button variant='rose' size='xs' disabled>
                    Rose
                  </Button>
                  <Button variant='outline-rose' size='xs' disabled>
                    Rose
                  </Button>
                  <Button variant='orange' size='xs' disabled>
                    Orange
                  </Button>
                  <Button variant='outline-orange' size='xs' disabled>
                    Orange
                  </Button>
                  <Button variant='yellow' size='xs' disabled>
                    Yellow
                  </Button>
                  <Button variant='outline-yellow' size='xs' disabled>
                    Yellow
                  </Button>
                  <Button variant='green' size='xs' disabled>
                    Green
                  </Button>
                  <Button variant='outline-green' size='xs' disabled>
                    Green
                  </Button>
                  <Button variant='teal' size='xs' disabled>
                    Teal
                  </Button>
                  <Button variant='outline-teal' size='xs' disabled>
                    Teal
                  </Button>
                  <Button variant='cyan' size='xs' disabled>
                    Cyan
                  </Button>
                  <Button variant='outline-cyan' size='xs' disabled>
                    Cyan
                  </Button>
                </div>
              </div>
            </div>
            <div className='flex gap-4 justify-between'>
              <div className='grid grid-cols-1 gap-4 pb-4'>
                <div className='flex items-center text-slate-800 text-lg'>Small size:</div>
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='primary' size='sm'>
                    Primary
                  </Button>
                  <Button variant='outline-primary' size='sm'>
                    Primary
                  </Button>
                  <Button variant='secondary' size='sm'>
                    Secondary
                  </Button>
                  <Button variant='outline-secondary' size='sm'>
                    Secondary
                  </Button>
                  <Button variant='success' size='sm'>
                    Success
                  </Button>
                  <Button variant='outline-success' size='sm'>
                    Success
                  </Button>
                  <Button variant='warning' size='sm'>
                    Warning
                  </Button>
                  <Button variant='outline-warning' size='sm'>
                    Warning
                  </Button>
                  <Button variant='danger' size='sm'>
                    Danger
                  </Button>
                  <Button variant='outline-danger' size='sm'>
                    Danger
                  </Button>
                  <Button variant='slate' size='sm'>
                    Slate
                  </Button>
                  <Button variant='outline-slate' size='sm'>
                    Slate
                  </Button>
                  <Button variant='blue' size='sm'>
                    Blue
                  </Button>
                  <Button variant='outline-blue' size='sm'>
                    Blue
                  </Button>
                  <Button variant='indigo' size='sm'>
                    Indigo
                  </Button>
                  <Button variant='outline-indigo' size='sm'>
                    Indigo
                  </Button>
                  <Button variant='purple' size='sm'>
                    Purple
                  </Button>
                  <Button variant='outline-purple' size='sm'>
                    Purple
                  </Button>
                  <Button variant='pink' size='sm'>
                    Pink
                  </Button>
                  <Button variant='outline-pink' size='sm'>
                    Pink
                  </Button>
                  <Button variant='rose' size='sm'>
                    Rose
                  </Button>
                  <Button variant='outline-rose' size='sm'>
                    Rose
                  </Button>
                  <Button variant='orange' size='sm'>
                    Orange
                  </Button>
                  <Button variant='outline-orange' size='sm'>
                    Orange
                  </Button>
                  <Button variant='yellow' size='sm'>
                    Yellow
                  </Button>
                  <Button variant='outline-yellow' size='sm'>
                    Yellow
                  </Button>
                  <Button variant='green' size='sm'>
                    Green
                  </Button>
                  <Button variant='outline-green' size='sm'>
                    Green
                  </Button>
                  <Button variant='teal' size='sm'>
                    Teal
                  </Button>
                  <Button variant='outline-teal' size='sm'>
                    Teal
                  </Button>
                  <Button variant='cyan' size='sm'>
                    Cyan
                  </Button>
                  <Button variant='outline-cyan' size='sm'>
                    Cyan
                  </Button>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-4 pb-4'>
                <div className='flex items-center text-slate-800 text-lg'>
                  Small size with disabled:
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='primary' size='sm' disabled>
                    Primary
                  </Button>
                  <Button variant='outline-primary' size='sm' disabled>
                    Primary
                  </Button>
                  <Button variant='secondary' size='sm' disabled>
                    Secondary
                  </Button>
                  <Button variant='outline-secondary' size='sm' disabled>
                    Secondary
                  </Button>
                  <Button variant='success' size='sm' disabled>
                    Success
                  </Button>
                  <Button variant='outline-success' size='sm' disabled>
                    Success
                  </Button>
                  <Button variant='warning' size='sm' disabled>
                    Warning
                  </Button>
                  <Button variant='outline-warning' size='sm' disabled>
                    Warning
                  </Button>
                  <Button variant='danger' size='sm' disabled>
                    Danger
                  </Button>
                  <Button variant='outline-danger' size='sm' disabled>
                    Danger
                  </Button>
                  <Button variant='slate' size='sm' disabled>
                    Slate
                  </Button>
                  <Button variant='outline-slate' size='sm' disabled>
                    Slate
                  </Button>
                  <Button variant='blue' size='sm' disabled>
                    Blue
                  </Button>
                  <Button variant='outline-blue' size='sm' disabled>
                    Blue
                  </Button>
                  <Button variant='indigo' size='sm' disabled>
                    Indigo
                  </Button>
                  <Button variant='outline-indigo' size='sm' disabled>
                    Indigo
                  </Button>
                  <Button variant='purple' size='sm' disabled>
                    Purple
                  </Button>
                  <Button variant='outline-purple' size='sm' disabled>
                    Purple
                  </Button>
                  <Button variant='pink' size='sm' disabled>
                    Pink
                  </Button>
                  <Button variant='outline-pink' size='sm' disabled>
                    Pink
                  </Button>
                  <Button variant='rose' size='sm' disabled>
                    Rose
                  </Button>
                  <Button variant='outline-rose' size='sm' disabled>
                    Rose
                  </Button>
                  <Button variant='orange' size='sm' disabled>
                    Orange
                  </Button>
                  <Button variant='outline-orange' size='sm' disabled>
                    Orange
                  </Button>
                  <Button variant='yellow' size='sm' disabled>
                    Yellow
                  </Button>
                  <Button variant='outline-yellow' size='sm' disabled>
                    Yellow
                  </Button>
                  <Button variant='green' size='sm' disabled>
                    Green
                  </Button>
                  <Button variant='outline-green' size='sm' disabled>
                    Green
                  </Button>
                  <Button variant='teal' size='sm' disabled>
                    Teal
                  </Button>
                  <Button variant='outline-teal' size='sm' disabled>
                    Teal
                  </Button>
                  <Button variant='cyan' size='sm' disabled>
                    Cyan
                  </Button>
                  <Button variant='outline-cyan' size='sm' disabled>
                    Cyan
                  </Button>
                </div>
              </div>
            </div>
            <div className='flex gap-4 justify-between'>
              <div className='grid grid-cols-1 gap-4 pb-4'>
                <div className='flex items-center text-slate-800 text-lg'>Large size:</div>
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='primary' size='lg'>
                    Primary
                  </Button>
                  <Button variant='outline-primary' size='lg'>
                    Primary
                  </Button>
                  <Button variant='secondary' size='lg'>
                    Secondary
                  </Button>
                  <Button variant='outline-secondary' size='lg'>
                    Secondary
                  </Button>
                  <Button variant='success' size='lg'>
                    Success
                  </Button>
                  <Button variant='outline-success' size='lg'>
                    Success
                  </Button>
                  <Button variant='warning' size='lg'>
                    Warning
                  </Button>
                  <Button variant='outline-warning' size='lg'>
                    Warning
                  </Button>
                  <Button variant='danger' size='lg'>
                    Danger
                  </Button>
                  <Button variant='outline-danger' size='lg'>
                    Danger
                  </Button>
                  <Button variant='slate' size='lg'>
                    Slate
                  </Button>
                  <Button variant='outline-slate' size='lg'>
                    Slate
                  </Button>
                  <Button variant='blue' size='lg'>
                    Blue
                  </Button>
                  <Button variant='outline-blue' size='lg'>
                    Blue
                  </Button>
                  <Button variant='indigo' size='lg'>
                    Indigo
                  </Button>
                  <Button variant='outline-indigo' size='lg'>
                    Indigo
                  </Button>
                  <Button variant='purple' size='lg'>
                    Purple
                  </Button>
                  <Button variant='outline-purple' size='lg'>
                    Purple
                  </Button>
                  <Button variant='pink' size='lg'>
                    Pink
                  </Button>
                  <Button variant='outline-pink' size='lg'>
                    Pink
                  </Button>
                  <Button variant='rose' size='lg'>
                    Rose
                  </Button>
                  <Button variant='outline-rose' size='lg'>
                    Rose
                  </Button>
                  <Button variant='orange' size='lg'>
                    Orange
                  </Button>
                  <Button variant='outline-orange' size='lg'>
                    Orange
                  </Button>
                  <Button variant='yellow' size='lg'>
                    Yellow
                  </Button>
                  <Button variant='outline-yellow' size='lg'>
                    Yellow
                  </Button>
                  <Button variant='green' size='lg'>
                    Green
                  </Button>
                  <Button variant='outline-green' size='lg'>
                    Green
                  </Button>
                  <Button variant='teal' size='lg'>
                    Teal
                  </Button>
                  <Button variant='outline-teal' size='lg'>
                    Teal
                  </Button>
                  <Button variant='cyan' size='lg'>
                    Cyan
                  </Button>
                  <Button variant='outline-cyan' size='lg'>
                    Cyan
                  </Button>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-4 pb-4'>
                <div className='flex items-center text-slate-800 text-lg'>
                  Large size with disabled:
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='primary' size='lg' disabled>
                    Primary
                  </Button>
                  <Button variant='outline-primary' size='lg' disabled>
                    Primary
                  </Button>
                  <Button variant='secondary' size='lg' disabled>
                    Secondary
                  </Button>
                  <Button variant='outline-secondary' size='lg' disabled>
                    Secondary
                  </Button>
                  <Button variant='success' size='lg' disabled>
                    Success
                  </Button>
                  <Button variant='outline-success' size='lg' disabled>
                    Success
                  </Button>
                  <Button variant='warning' size='lg' disabled>
                    Warning
                  </Button>
                  <Button variant='outline-warning' size='lg' disabled>
                    Warning
                  </Button>
                  <Button variant='danger' size='lg' disabled>
                    Danger
                  </Button>
                  <Button variant='outline-danger' size='lg' disabled>
                    Danger
                  </Button>
                  <Button variant='slate' size='lg' disabled>
                    Slate
                  </Button>
                  <Button variant='outline-slate' size='lg' disabled>
                    Slate
                  </Button>
                  <Button variant='blue' size='lg' disabled>
                    Blue
                  </Button>
                  <Button variant='outline-blue' size='lg' disabled>
                    Blue
                  </Button>
                  <Button variant='indigo' size='lg' disabled>
                    Indigo
                  </Button>
                  <Button variant='outline-indigo' size='lg' disabled>
                    Indigo
                  </Button>
                  <Button variant='purple' size='lg' disabled>
                    Purple
                  </Button>
                  <Button variant='outline-purple' size='lg' disabled>
                    Purple
                  </Button>
                  <Button variant='pink' size='lg' disabled>
                    Pink
                  </Button>
                  <Button variant='outline-pink' size='lg' disabled>
                    Pink
                  </Button>
                  <Button variant='rose' size='lg' disabled>
                    Rose
                  </Button>
                  <Button variant='outline-rose' size='lg' disabled>
                    Rose
                  </Button>
                  <Button variant='orange' size='lg' disabled>
                    Orange
                  </Button>
                  <Button variant='outline-orange' size='lg' disabled>
                    Orange
                  </Button>
                  <Button variant='yellow' size='lg' disabled>
                    Yellow
                  </Button>
                  <Button variant='outline-yellow' size='lg' disabled>
                    Yellow
                  </Button>
                  <Button variant='green' size='lg' disabled>
                    Green
                  </Button>
                  <Button variant='outline-green' size='lg' disabled>
                    Green
                  </Button>
                  <Button variant='teal' size='lg' disabled>
                    Teal
                  </Button>
                  <Button variant='outline-teal' size='lg' disabled>
                    Teal
                  </Button>
                  <Button variant='cyan' size='lg' disabled>
                    Cyan
                  </Button>
                  <Button variant='outline-cyan' size='lg' disabled>
                    Cyan
                  </Button>
                </div>
              </div>
            </div>
            <div className='flex gap-4 justify-between'>
              <div className='grid grid-cols-1 gap-4 pb-4'>
                <div className='flex items-center text-slate-800 text-lg'>Extra large size:</div>
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='primary' size='xl'>
                    Primary
                  </Button>
                  <Button variant='outline-primary' size='xl'>
                    Primary
                  </Button>
                  <Button variant='secondary' size='xl'>
                    Secondary
                  </Button>
                  <Button variant='outline-secondary' size='xl'>
                    Secondary
                  </Button>
                  <Button variant='success' size='xl'>
                    Success
                  </Button>
                  <Button variant='outline-success' size='xl'>
                    Success
                  </Button>
                  <Button variant='warning' size='xl'>
                    Warning
                  </Button>
                  <Button variant='outline-warning' size='xl'>
                    Warning
                  </Button>
                  <Button variant='danger' size='xl'>
                    Danger
                  </Button>
                  <Button variant='outline-danger' size='xl'>
                    Danger
                  </Button>
                  <Button variant='slate' size='xl'>
                    Slate
                  </Button>
                  <Button variant='outline-slate' size='xl'>
                    Slate
                  </Button>
                  <Button variant='blue' size='xl'>
                    Blue
                  </Button>
                  <Button variant='outline-blue' size='xl'>
                    Blue
                  </Button>
                  <Button variant='indigo' size='xl'>
                    Indigo
                  </Button>
                  <Button variant='outline-indigo' size='xl'>
                    Indigo
                  </Button>
                  <Button variant='purple' size='xl'>
                    Purple
                  </Button>
                  <Button variant='outline-purple' size='xl'>
                    Purple
                  </Button>
                  <Button variant='pink' size='xl'>
                    Pink
                  </Button>
                  <Button variant='outline-pink' size='xl'>
                    Pink
                  </Button>
                  <Button variant='rose' size='xl'>
                    Rose
                  </Button>
                  <Button variant='outline-rose' size='xl'>
                    Rose
                  </Button>
                  <Button variant='orange' size='xl'>
                    Orange
                  </Button>
                  <Button variant='outline-orange' size='xl'>
                    Orange
                  </Button>
                  <Button variant='yellow' size='xl'>
                    Yellow
                  </Button>
                  <Button variant='outline-yellow' size='xl'>
                    Yellow
                  </Button>
                  <Button variant='green' size='xl'>
                    Green
                  </Button>
                  <Button variant='outline-green' size='xl'>
                    Green
                  </Button>
                  <Button variant='teal' size='xl'>
                    Teal
                  </Button>
                  <Button variant='outline-teal' size='xl'>
                    Teal
                  </Button>
                  <Button variant='cyan' size='xl'>
                    Cyan
                  </Button>
                  <Button variant='outline-cyan' size='xl'>
                    Cyan
                  </Button>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-4 pb-4'>
                <div className='flex items-center text-slate-800 text-lg'>
                  Extra large size with disabled:
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <Button variant='primary' size='xl' disabled>
                    Primary
                  </Button>
                  <Button variant='outline-primary' size='xl' disabled>
                    Primary
                  </Button>
                  <Button variant='secondary' size='xl' disabled>
                    Secondary
                  </Button>
                  <Button variant='outline-secondary' size='xl' disabled>
                    Secondary
                  </Button>
                  <Button variant='success' size='xl' disabled>
                    Success
                  </Button>
                  <Button variant='outline-success' size='xl' disabled>
                    Success
                  </Button>
                  <Button variant='warning' size='xl' disabled>
                    Warning
                  </Button>
                  <Button variant='outline-warning' size='xl' disabled>
                    Warning
                  </Button>
                  <Button variant='danger' size='xl' disabled>
                    Danger
                  </Button>
                  <Button variant='outline-danger' size='xl' disabled>
                    Danger
                  </Button>
                  <Button variant='slate' size='xl' disabled>
                    Slate
                  </Button>
                  <Button variant='outline-slate' size='xl' disabled>
                    Slate
                  </Button>
                  <Button variant='blue' size='xl' disabled>
                    Blue
                  </Button>
                  <Button variant='outline-blue' size='xl' disabled>
                    Blue
                  </Button>
                  <Button variant='indigo' size='xl' disabled>
                    Indigo
                  </Button>
                  <Button variant='outline-indigo' size='xl' disabled>
                    Indigo
                  </Button>
                  <Button variant='purple' size='xl' disabled>
                    Purple
                  </Button>
                  <Button variant='outline-purple' size='xl' disabled>
                    Purple
                  </Button>
                  <Button variant='pink' size='xl' disabled>
                    Pink
                  </Button>
                  <Button variant='outline-pink' size='xl' disabled>
                    Pink
                  </Button>
                  <Button variant='rose' size='xl' disabled>
                    Rose
                  </Button>
                  <Button variant='outline-rose' size='xl' disabled>
                    Rose
                  </Button>
                  <Button variant='orange' size='xl' disabled>
                    Orange
                  </Button>
                  <Button variant='outline-orange' size='xl' disabled>
                    Orange
                  </Button>
                  <Button variant='yellow' size='xl' disabled>
                    Yellow
                  </Button>
                  <Button variant='outline-yellow' size='xl' disabled>
                    Yellow
                  </Button>
                  <Button variant='green' size='xl' disabled>
                    Green
                  </Button>
                  <Button variant='outline-green' size='xl' disabled>
                    Green
                  </Button>
                  <Button variant='teal' size='xl' disabled>
                    Teal
                  </Button>
                  <Button variant='outline-teal' size='xl' disabled>
                    Teal
                  </Button>
                  <Button variant='cyan' size='xl' disabled>
                    Cyan
                  </Button>
                  <Button variant='outline-cyan' size='xl' disabled>
                    Cyan
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='col-span-2'>
          <CardHeader className='p-4 border-b border-slate-100'>
            <CardTitle className='text-lg font-normal'>Form</CardTitle>
          </CardHeader>
          <CardContent className='p-4 max-h-72 overflow-auto'>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>Input：</div>
              <div className='grid grid-cols-3 gap-4'>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name:</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Last name:</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Mr.</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='mr'>Mr.</SelectItem>
                      <SelectItem value='mrs'>Mrs.</SelectItem>
                      <SelectItem value='miss'>Miss</SelectItem>
                      <SelectItem value='dr'>Dr.</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Datepicker：</Label>
                  <DatePicker onChange={handleDateSelect} />
                </div>
                <div className='col-span-2 flex flex-col gap-y-1'>
                  <Label>Datepicker Range:</Label>
                  <DatePicker mode='range' onChange={handleDateRangeSelect} />
                </div>
                <div className='flex flex-col gap-4 pb-4'>
                  <div className='flex items-center text-slate-800 text-lg'>Checkbox：</div>
                  <div className='flex items-center gap-4'>
                    <div className='inline-flex'>
                      <Checkbox id='ha-unchecked' />
                      <Label className='ms-2' htmlFor='ha-unchecked'>
                        unchecked
                      </Label>
                    </div>
                    <div className='inline-flex'>
                      <Checkbox id='ha-checked' defaultChecked />
                      <Label className='ms-2' htmlFor='ha-checked'>
                        checked
                      </Label>
                    </div>
                  </div>
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Description：</Label>
                  <Textarea rows={3}></Textarea>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>Disabled Input:</div>
              <div className='grid grid-cols-3 gap-4'>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name:</Label>
                  <Input type='text' placeholder='' disabled />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Last name:</Label>
                  <Input type='text' placeholder='' disabled />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Mr.</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='mr'>Mr.</SelectItem>
                      <SelectItem value='mrs'>Mrs.</SelectItem>
                      <SelectItem value='miss'>Miss</SelectItem>
                      <SelectItem value='dr'>Dr.</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Datepicker：</Label>
                  <DatePicker onChange={handleDateSelect} disabled />
                </div>
                <div className='col-span-2 flex flex-col gap-y-1'>
                  <Label>Datepicker Range:</Label>
                  <DatePicker mode='range' onChange={handleDateRangeSelect} disabled />
                </div>
                <div className='flex flex-col gap-4 pb-4'>
                  <div className='flex items-center text-slate-800 text-lg'>Checkbox：</div>
                  <div className='flex items-center gap-4'>
                    <div className='inline-flex'>
                      <Checkbox id='ha-disabled-unchecked' disabled />
                      <Label className='ms-2' htmlFor='ha-disabled-unchecked'>
                        disabled unchecked
                      </Label>
                    </div>
                    <div className='inline-flex'>
                      <Checkbox id='ha-disabled-checked' disabled defaultChecked />
                      <Label className='ms-2' htmlFor='ha-disabled-checked'>
                        disabled checked
                      </Label>
                    </div>
                  </div>
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Description：</Label>
                  <Textarea rows={3} disabled></Textarea>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='p-4 border-b border-slate-100'>
            <CardTitle className='text-lg font-normal'>Badge</CardTitle>
          </CardHeader>
          <CardContent className='p-4 max-h-72 overflow-auto'>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>Default size:</div>
              <div className='flex gap-4'>
                <Badge variant='primary' />
                <Badge variant='outline-primary' />
                <Badge variant='secondary' />
                <Badge variant='outline-secondary' />
                <Badge variant='success' />
                <Badge variant='outline-success' />
                <Badge variant='warning' />
                <Badge variant='outline-warning' />
                <Badge variant='danger' />
                <Badge variant='outline-danger' />
                <Badge variant='slate' />
                <Badge variant='outline-slate' />
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>
                Default size with text:
              </div>
              <div className='flex gap-4'>
                <Badge variant='primary'>23</Badge>
                <Badge variant='outline-primary'>23</Badge>
                <Badge variant='secondary'>23</Badge>
                <Badge variant='outline-secondary'>23</Badge>
                <Badge variant='success'>23</Badge>
                <Badge variant='outline-success'>23</Badge>
                <Badge variant='warning'>23</Badge>
                <Badge variant='outline-warning'>23</Badge>
                <Badge variant='danger'>23</Badge>
                <Badge variant='outline-danger'>23</Badge>
                <Badge variant='slate'>23</Badge>
                <Badge variant='outline-slate'>23</Badge>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>
                Default size with icon:
              </div>
              <div className='flex gap-4'>
                <Badge variant='primary'>
                  <Icons name='IconCalendar' />
                </Badge>
                <Badge variant='outline-primary'>
                  <Icons name='IconPlus' />
                </Badge>
                <Badge variant='secondary'>
                  <Icons name='IconPencil' />
                </Badge>
                <Badge variant='outline-secondary'>
                  <Icons name='IconCategory' />
                </Badge>
                <Badge variant='success'>
                  <Icons name='IconArrowsMaximize' />
                </Badge>
                <Badge variant='outline-success'>
                  <Icons name='IconCopy' />
                </Badge>
                <Badge variant='warning'>
                  <Icons name='IconFilter' />
                </Badge>
                <Badge variant='outline-warning'>
                  <Icons name='IconTrash' />
                </Badge>
                <Badge variant='danger'>
                  <Icons name='IconHash' />
                </Badge>
                <Badge variant='outline-danger'>
                  <Icons name='IconSquareRoundedCheck' />
                </Badge>
                <Badge variant='slate'>
                  <Icons name='IconCircleMinus' />
                </Badge>
                <Badge variant='outline-slate'>
                  <Icons name='IconLayoutBoard' />
                </Badge>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>Extra Small size:</div>
              <div className='flex gap-4'>
                <Badge variant='primary' size='xs' />
                <Badge variant='outline-primary' size='xs' />
                <Badge variant='secondary' size='xs' />
                <Badge variant='outline-secondary' size='xs' />
                <Badge variant='success' size='xs' />
                <Badge variant='outline-success' size='xs' />
                <Badge variant='warning' size='xs' />
                <Badge variant='outline-warning' size='xs' />
                <Badge variant='danger' size='xs' />
                <Badge variant='outline-danger' size='xs' />
                <Badge variant='slate' size='xs' />
                <Badge variant='outline-slate' size='xs' />
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>Small size:</div>
              <div className='flex gap-4'>
                <Badge variant='primary' size='sm' />
                <Badge variant='outline-primary' size='sm' />
                <Badge variant='secondary' size='sm' />
                <Badge variant='outline-secondary' size='sm' />
                <Badge variant='success' size='sm' />
                <Badge variant='outline-success' size='sm' />
                <Badge variant='warning' size='sm' />
                <Badge variant='outline-warning' size='sm' />
                <Badge variant='danger' size='sm' />
                <Badge variant='outline-danger' size='sm' />
                <Badge variant='slate' size='sm' />
                <Badge variant='outline-slate' size='sm' />
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>Large size:</div>
              <div className='flex gap-4'>
                <Badge variant='primary' size='lg' />
                <Badge variant='outline-primary' size='lg' />
                <Badge variant='secondary' size='lg' />
                <Badge variant='outline-secondary' size='lg' />
                <Badge variant='success' size='lg' />
                <Badge variant='outline-success' size='lg' />
                <Badge variant='warning' size='lg' />
                <Badge variant='outline-warning' size='lg' />
                <Badge variant='danger' size='lg' />
                <Badge variant='outline-danger' size='lg' />
                <Badge variant='slate' size='lg' />
                <Badge variant='outline-slate' size='lg' />
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>Large size with text:</div>
              <div className='flex gap-4'>
                <Badge variant='primary' size='lg'>
                  23
                </Badge>
                <Badge variant='outline-primary' size='lg'>
                  23
                </Badge>
                <Badge variant='secondary' size='lg'>
                  23
                </Badge>
                <Badge variant='outline-secondary' size='lg'>
                  23
                </Badge>
                <Badge variant='success' size='lg'>
                  23
                </Badge>
                <Badge variant='outline-success' size='lg'>
                  23
                </Badge>
                <Badge variant='warning' size='lg'>
                  23
                </Badge>
                <Badge variant='outline-warning' size='lg'>
                  23
                </Badge>
                <Badge variant='danger' size='lg'>
                  23
                </Badge>
                <Badge variant='outline-danger' size='lg'>
                  23
                </Badge>
                <Badge variant='slate' size='lg'>
                  23
                </Badge>
                <Badge variant='outline-slate' size='lg'>
                  23
                </Badge>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>Large size with icon:</div>
              <div className='flex gap-4'>
                <Badge variant='primary' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
                <Badge variant='outline-primary' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
                <Badge variant='secondary' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
                <Badge variant='outline-secondary' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
                <Badge variant='success' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
                <Badge variant='outline-success' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
                <Badge variant='warning' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
                <Badge variant='outline-warning' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
                <Badge variant='danger' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
                <Badge variant='outline-danger' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
                <Badge variant='slate' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
                <Badge variant='outline-slate' size='lg'>
                  <Icons name='IconStar' />
                </Badge>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>Extra large size:</div>
              <div className='flex gap-4'>
                <Badge variant='primary' size='xl' />
                <Badge variant='outline-primary' size='xl' />
                <Badge variant='secondary' size='xl' />
                <Badge variant='outline-secondary' size='xl' />
                <Badge variant='success' size='xl' />
                <Badge variant='outline-success' size='xl' />
                <Badge variant='warning' size='xl' />
                <Badge variant='outline-warning' size='xl' />
                <Badge variant='danger' size='xl' />
                <Badge variant='outline-danger' size='xl' />
                <Badge variant='slate' size='xl' />
                <Badge variant='outline-slate' size='xl' />
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>
                Extra large size with text:
              </div>
              <div className='flex gap-4'>
                <Badge variant='primary' size='xl'>
                  23
                </Badge>
                <Badge variant='outline-primary' size='xl'>
                  23
                </Badge>
                <Badge variant='secondary' size='xl'>
                  23
                </Badge>
                <Badge variant='outline-secondary' size='xl'>
                  23
                </Badge>
                <Badge variant='success' size='xl'>
                  23
                </Badge>
                <Badge variant='outline-success' size='xl'>
                  23
                </Badge>
                <Badge variant='warning' size='xl'>
                  23
                </Badge>
                <Badge variant='outline-warning' size='xl'>
                  23
                </Badge>
                <Badge variant='danger' size='xl'>
                  23
                </Badge>
                <Badge variant='outline-danger' size='xl'>
                  23
                </Badge>
                <Badge variant='slate' size='xl'>
                  23
                </Badge>
                <Badge variant='outline-slate' size='xl'>
                  23
                </Badge>
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 pb-4'>
              <div className='flex items-center text-slate-800 text-lg'>
                Extra large size with icon:
              </div>
              <div className='flex gap-4'>
                <Badge variant='primary' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
                <Badge variant='outline-primary' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
                <Badge variant='secondary' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
                <Badge variant='outline-secondary' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
                <Badge variant='success' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
                <Badge variant='outline-success' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
                <Badge variant='warning' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
                <Badge variant='outline-warning' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
                <Badge variant='danger' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
                <Badge variant='outline-danger' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
                <Badge variant='slate' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
                <Badge variant='outline-slate' size='xl'>
                  <Icons name='IconUser' />
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='col-span-full'>
          <CardHeader className='p-4 border-b border-slate-100'>
            <CardTitle className='text-lg font-normal'>Table</CardTitle>
          </CardHeader>
          <CardContent className='px-0 pb-0 overflow-auto'>
            <TableView
              pageSize={6}
              selected
              visibleControl
              header={[
                { title: '姓名', code: 'name' },
                { title: '性别', code: 'sex' },
                { title: '年龄', code: 'age' },
                { title: '所属部门', code: 'department' },
                { title: '职务', code: 'position' },
                { title: '操作', code: 'operation' }
              ]}
              data={[
                {
                  id: 1,
                  name: '张三',
                  sex: '男',
                  age: 18,
                  department: '研发部',
                  position: '总监'
                },
                {
                  id: 2,
                  name: '李四',
                  sex: '男',
                  age: 20,
                  department: '销售部',
                  position: '销售'
                },
                {
                  id: 3,
                  name: '王五',
                  sex: '女',
                  age: 22,
                  department: '市场部',
                  position: '市场'
                },
                {
                  id: 4,
                  name: '赵六',
                  sex: '男',
                  age: 24,
                  department: '财务部',
                  position: '财务'
                },
                {
                  id: 5,
                  name: '田七',
                  sex: '女',
                  age: 26,
                  department: '人事部',
                  position: '人事'
                },
                {
                  id: 6,
                  name: '钱八',
                  sex: '男',
                  age: 28,
                  department: '运营部',
                  position: '运营'
                },
                {
                  id: 7,
                  name: '孙九',
                  sex: '男',
                  age: 30,
                  department: '行政部',
                  position: '行政'
                },
                {
                  id: 8,
                  name: '周十',
                  sex: '男',
                  age: 32,
                  department: '运营部',
                  position: '运营'
                },
                {
                  id: 9,
                  name: '吴十一',
                  sex: '男',
                  age: 34,
                  department: '行政部',
                  position: '行政'
                },
                {
                  id: 10,
                  name: '郑十二',
                  sex: '男',
                  age: 36,
                  department: '行政部',
                  position: '行政'
                }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='p-4 border-b border-slate-100'>
            <CardTitle className='text-lg font-normal'>File Upload</CardTitle>
          </CardHeader>
          <CardContent className='overflow-auto pt-6'>
            <Uploader
              value={files}
              onValueChange={handleValueChange}
              maxFiles={10}
              maxSize={5 * 1024 * 1024}
              // accept={['image/*', 'video/*']}
            />
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};
