import React, { useState, useCallback } from 'react';

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  Uploader,
  Alert,
  AlertDialog,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Switch,
  Slider,
  Progress,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Dialog,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Divider,
  Skeleton,
  ColorPicker,
  IconPicker,
  RadioGroup,
  CheckboxGroup,
  MultiSelect,
  TreeSelect,
  ToastProvider,
  ToastContainer,
  useToastMessage,
  Portal
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Page, Topbar } from '@/components/layout';
import { uploadConfigs, useUpload } from '@/hooks';

export const UITopbar = ({ ...rest }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const topbarElement = {
    title: t('example.ui.title'),
    left: [
      <div className='rounded-md flex items-center justify-between gap-x-1' key='left'>
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
      <div className='rounded-md flex items-center justify-between gap-x-1' key='right-1'>
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
      <div
        className='bg-slate-100 p-1 rounded-md flex items-center justify-between gap-x-2'
        key='right-2'
      >
        <Tooltip side='bottom' content='Card Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white'
            onClick={() => navigate('/example/card')}
          >
            <Icons name='IconLayoutBoard' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='List Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white'
            onClick={() => navigate('/example/list-2')}
          >
            <Icons name='IconTableColumn' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='Table Layout'>
          <Button
            variant='unstyle'
            size='ratio'
            className='p-1 hover:bg-white'
            onClick={() => navigate('/example/list-1')}
          >
            <Icons name='IconTable' />
          </Button>
        </Tooltip>
        <Tooltip side='bottom' content='Full Screen'>
          <Button variant='unstyle' size='ratio' className='p-1 hover:bg-white'>
            <Icons name='IconArrowsMaximize' />
          </Button>
        </Tooltip>
      </div>
    ]
  };

  return <Topbar {...topbarElement} {...rest} />;
};

export const Elements = ({ ...rest }) => {
  // Toast system
  const toast = useToastMessage();

  // State management
  const [basicFiles, setBasicFiles] = useState<File[] | null>([]);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [selectedColor, setSelectedColor] = useState('#2563EB');
  const [selectedIcon, setSelectedIcon] = useState('IconStar');
  const [switchValue, setSwitchValue] = useState(false);
  const [sliderValue, setSliderValue] = useState([50]);
  const [progressValue, setProgressValue] = useState(60);
  const [radioValue, setRadioValue] = useState('option1');
  const [checkboxValues, setCheckboxValues] = useState<string[]>(['option1']);
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [treeSelectValue, setTreeSelectValue] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  // Date handlers
  const handleDateSelect = useCallback((date: any) => {
    console.log('Date selected:', date);
  }, []);

  const handleDateRangeSelect = useCallback((range: any) => {
    console.log('Date range selected:', range);
  }, []);

  // Upload configuration
  const imageUpload = useUpload(uploadConfigs.image('example-images', 'system'));
  const documentUpload = useUpload(uploadConfigs.document('example-docs', 'system', true));

  // Upload handlers
  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        return await imageUpload.uploadFile(file);
      } catch (error) {
        console.error('Image upload failed:', error);
        throw error;
      }
    },
    [imageUpload]
  );

  const handleDocumentUpload = useCallback(
    async (file: File) => {
      try {
        return await documentUpload.uploadFile(file);
      } catch (error) {
        console.error('Document upload failed:', error);
        throw error;
      }
    },
    [documentUpload]
  );

  const handleBasicFileChange = useCallback((value: File | File[] | null) => {
    setBasicFiles(Array.isArray(value) ? value : value ? [value] : []);
  }, []);

  const handleMultipleFilesChange = useCallback((value: File | File[] | null) => {
    const filesArray = Array.isArray(value) ? value : value ? [value] : [];
    setMultipleFiles(filesArray);

    if (filesArray.length > 0) {
      console.log('Multiple files selected:', {
        count: filesArray.length,
        files: filesArray.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      });
    }
  }, []);

  // Toast handlers
  const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        toast.success('Success!', { description: 'Operation completed successfully.' });
        break;
      case 'error':
        toast.error('Error!', { description: 'Something went wrong.' });
        break;
      case 'warning':
        toast.warning('Warning!', { description: 'Please check your input.' });
        break;
      case 'info':
        toast.info('Info!', { description: 'Here is some information.' });
        break;
    }
  };

  // Sample data for complex components
  const tableData = [
    { id: 1, name: 'John Doe', role: 'Developer', department: 'Engineering', status: 'Active' },
    { id: 2, name: 'Jane Smith', role: 'Designer', department: 'Design', status: 'Active' },
    { id: 3, name: 'Bob Johnson', role: 'Manager', department: 'Sales', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', role: 'Analyst', department: 'Marketing', status: 'Active' },
    {
      id: 5,
      name: 'Charlie Wilson',
      role: 'Developer',
      department: 'Engineering',
      status: 'Active'
    },
    { id: 6, name: 'Diana Davis', role: 'Designer', department: 'Design', status: 'Pending' }
  ];

  const selectOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Option 4', value: 'option4' }
  ];

  const treeOptions = [
    {
      label: 'Technology',
      value: 'tech',
      children: [
        { label: 'Frontend', value: 'frontend' },
        { label: 'Backend', value: 'backend' },
        { label: 'Mobile', value: 'mobile' }
      ]
    },
    {
      label: 'Design',
      value: 'design',
      children: [
        { label: 'UI/UX', value: 'uiux' },
        { label: 'Graphics', value: 'graphics' }
      ]
    }
  ];

  return (
    <ToastProvider>
      <Page sidebar {...rest} topbar={<UITopbar />}>
        <Tabs defaultValue='basic'>
          <TabsList className='w-full justify-start mb-4'>
            <TabsTrigger value='basic'>Basic</TabsTrigger>
            <TabsTrigger value='forms'>Forms</TabsTrigger>
            <TabsTrigger value='data'>Data Display</TabsTrigger>
            <TabsTrigger value='feedback'>Feedback</TabsTrigger>
            <TabsTrigger value='navigation'>Navigation</TabsTrigger>
            <TabsTrigger value='layout'>Layout</TabsTrigger>
          </TabsList>

          {/* Basic Components */}
          <TabsContent value='basic'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Button Component */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Button</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div>
                    <div className='text-slate-800 text-lg mb-2'>Variants:</div>
                    <div className='grid grid-cols-2 gap-2'>
                      <Button variant='primary'>Primary</Button>
                      <Button variant='outline-primary'>Outline</Button>
                      <Button variant='secondary'>Secondary</Button>
                      <Button variant='success'>Success</Button>
                      <Button variant='warning'>Warning</Button>
                      <Button variant='danger'>Danger</Button>
                    </div>
                  </div>

                  <div>
                    <div className='text-slate-800 text-lg mb-2'>Sizes:</div>
                    <div className='flex flex-wrap gap-2'>
                      <Button variant='primary' size='xs'>
                        Extra Small
                      </Button>
                      <Button variant='primary' size='sm'>
                        Small
                      </Button>
                      <Button variant='primary' size='md'>
                        Medium
                      </Button>
                      <Button variant='primary' size='lg'>
                        Large
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className='text-slate-800 text-lg mb-2'>With Icons:</div>
                    <div className='flex flex-wrap gap-2'>
                      <Button variant='primary' startIcon={<Icons name='IconPlus' />}>
                        Add Item
                      </Button>
                      <Button variant='outline' endIcon={<Icons name='IconArrowRight' />}>
                        Continue
                      </Button>
                      <Button variant='ghost' size='icon'>
                        <Icons name='IconSettings' />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className='text-slate-800 text-lg mb-2'>States:</div>
                    <div className='flex flex-wrap gap-2'>
                      <Button variant='primary' loading>
                        Loading
                      </Button>
                      <Button variant='secondary' disabled>
                        Disabled
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badge Component */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Badge</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div>
                    <div className='text-slate-800 text-lg mb-2'>Default badges:</div>
                    <div className='flex flex-wrap gap-2'>
                      <Badge variant='primary' />
                      <Badge variant='secondary' />
                      <Badge variant='success' />
                      <Badge variant='warning' />
                      <Badge variant='danger' />
                      <Badge variant='slate' />
                    </div>
                  </div>

                  <div>
                    <div className='text-slate-800 text-lg mb-2'>With text:</div>
                    <div className='flex flex-wrap gap-2'>
                      <Badge variant='primary'>New</Badge>
                      <Badge variant='success'>Active</Badge>
                      <Badge variant='warning'>Pending</Badge>
                      <Badge variant='danger'>Error</Badge>
                    </div>
                  </div>

                  <div>
                    <div className='text-slate-800 text-lg mb-2'>With icons:</div>
                    <div className='flex flex-wrap gap-2'>
                      <Badge variant='primary'>
                        <Icons name='IconStar' className='w-3 h-3' />
                      </Badge>
                      <Badge variant='success'>
                        <Icons name='IconCheck' className='w-3 h-3' />
                      </Badge>
                      <Badge variant='warning'>
                        <Icons name='IconAlert' className='w-3 h-3' />
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className='text-slate-800 text-lg mb-2'>Outline variants:</div>
                    <div className='flex flex-wrap gap-2'>
                      <Badge variant='outline-primary'>Primary</Badge>
                      <Badge variant='outline-success'>Success</Badge>
                      <Badge variant='outline-warning'>Warning</Badge>
                      <Badge variant='outline-danger'>Danger</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Avatar Component */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Avatar</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div>
                    <div className='text-slate-800 text-lg mb-2'>With Image:</div>
                    <div className='flex gap-3'>
                      <Avatar>
                        <AvatarImage src='https://github.com/shadcn.png' alt='Avatar' />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <Avatar className='h-12 w-12'>
                        <AvatarImage src='https://github.com/shadcn.png' alt='Avatar' />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  <div>
                    <div className='text-slate-800 text-lg mb-2'>Fallbacks:</div>
                    <div className='flex gap-3'>
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback>AB</AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback>XY</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Icons Component */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Icons</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div>
                    <div className='text-slate-800 text-lg mb-2'>Common Icons:</div>
                    <div className='grid grid-cols-8 gap-3'>
                      <Icons name='IconHome' />
                      <Icons name='IconUser' />
                      <Icons name='IconSettings' />
                      <Icons name='IconBell' />
                      <Icons name='IconMail' />
                      <Icons name='IconSearch' />
                      <Icons name='IconPlus' />
                      <Icons name='IconX' />
                    </div>
                  </div>

                  <div>
                    <div className='text-slate-800 text-lg mb-2'>Different Sizes:</div>
                    <div className='flex items-center gap-3'>
                      <Icons name='IconStar' size={16} />
                      <Icons name='IconStar' size={24} />
                      <Icons name='IconStar' size={32} />
                      <Icons name='IconStar' size={48} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forms Components */}
          <TabsContent value='forms'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Input & Select */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Input & Select</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div className='space-y-2'>
                    <Label>Text Input:</Label>
                    <Input type='text' placeholder='Enter text' />
                  </div>

                  <div className='space-y-2'>
                    <Label>Email Input:</Label>
                    <Input type='email' placeholder='Enter email' />
                  </div>

                  <div className='space-y-2'>
                    <Label>Password Input:</Label>
                    <Input type='password' placeholder='Enter password' />
                  </div>

                  <div className='space-y-2'>
                    <Label>Select:</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder='Select option' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='option1'>Option 1</SelectItem>
                        <SelectItem value='option2'>Option 2</SelectItem>
                        <SelectItem value='option3'>Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='space-y-2'>
                    <Label>Textarea:</Label>
                    <Textarea rows={3} placeholder='Enter description' />
                  </div>
                </CardContent>
              </Card>

              {/* Checkbox & Radio */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Checkbox & Radio</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div>
                    <div className='text-slate-800 text-lg mb-2'>Checkboxes:</div>
                    <CheckboxGroup
                      options={selectOptions}
                      value={checkboxValues}
                      onChange={setCheckboxValues}
                    />
                  </div>

                  <div>
                    <div className='text-slate-800 text-lg mb-2'>Radio Group:</div>
                    <RadioGroup
                      options={selectOptions}
                      value={radioValue}
                      onChange={setRadioValue}
                    />
                  </div>

                  <div>
                    <div className='text-slate-800 text-lg mb-2'>Single Checkbox:</div>
                    <div className='flex items-center space-x-2'>
                      <Checkbox id='terms' />
                      <Label htmlFor='terms'>Accept terms and conditions</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Date Pickers */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Date Pickers</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div className='space-y-2'>
                    <Label>Single Date:</Label>
                    <DatePicker onChange={handleDateSelect} />
                  </div>

                  <div className='space-y-2'>
                    <Label>Date Range:</Label>
                    <DatePicker mode='range' onChange={handleDateRangeSelect} />
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Selects */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Advanced Selects</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div className='space-y-2'>
                    <Label>Multi Select:</Label>
                    <MultiSelect
                      options={selectOptions}
                      value={multiSelectValue}
                      onChange={setMultiSelectValue}
                      placeholder='Select multiple options'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Tree Select:</Label>
                    <TreeSelect
                      options={treeOptions}
                      value={treeSelectValue}
                      onChange={setTreeSelectValue}
                      placeholder='Select from tree'
                      multiple
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Color & Icon Pickers */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Pickers</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div className='space-y-2'>
                    <Label>Color Picker:</Label>
                    <ColorPicker value={selectedColor} onChange={setSelectedColor} />
                  </div>

                  <div className='space-y-2'>
                    <Label>Icon Picker:</Label>
                    <div className='flex items-center gap-2'>
                      <Icons name={selectedIcon} />
                      <Input
                        value={selectedIcon}
                        readOnly
                        placeholder='Click to select icon'
                        onClick={() => {
                          // Icon picker would open here
                          console.log('Open icon picker');
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Component */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>File Upload</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div className='space-y-2'>
                    <Label>Basic Upload:</Label>
                    <Uploader
                      value={basicFiles}
                      onValueChange={handleBasicFileChange}
                      maxFiles={3}
                      maxSize={5 * 1024 * 1024}
                      placeholderText={{
                        main: 'Select files',
                        sub: 'or drag and drop',
                        hint: 'Any file type (max 5MB each)'
                      }}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Image Upload:</Label>
                    <Uploader
                      maxFiles={1}
                      maxSize={2 * 1024 * 1024}
                      accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] }}
                      autoUpload={true}
                      uploadFunction={handleImageUpload}
                      placeholderText={{
                        main: 'Upload image',
                        sub: 'or drag and drop',
                        hint: 'PNG, JPG, GIF, WebP (max 2MB)'
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Data Display Components */}
          <TabsContent value='data'>
            <div className='grid grid-cols-1 gap-6'>
              {/* Table */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Table</CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                  <TableView
                    header={[
                      { title: 'Name', accessorKey: 'name' },
                      { title: 'Role', accessorKey: 'role' },
                      { title: 'Department', accessorKey: 'department' },
                      { title: 'Status', accessorKey: 'status' }
                    ]}
                    data={tableData}
                    pageSize={6}
                    selected
                    visibleControl
                  />
                </CardContent>
              </Card>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Progress & Slider */}
                <Card>
                  <CardHeader className='p-4 border-b border-slate-100'>
                    <CardTitle className='text-lg font-normal'>Progress & Slider</CardTitle>
                  </CardHeader>
                  <CardContent className='p-4 space-y-6'>
                    <div className='space-y-2'>
                      <Label>Progress Bar:</Label>
                      <Progress value={progressValue} className='w-full' />
                      <div className='text-sm text-gray-500'>{progressValue}% completed</div>
                    </div>

                    <div className='space-y-2'>
                      <Label>Slider:</Label>
                      <Slider
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        max={100}
                        step={1}
                        className='w-full'
                      />
                      <div className='text-sm text-gray-500'>Value: {sliderValue[0]}</div>
                    </div>

                    <div className='space-y-2'>
                      <Label>Switch:</Label>
                      <Switch checked={switchValue} onCheckedChange={setSwitchValue} />
                      <div className='text-sm text-gray-500'>
                        Switch is {switchValue ? 'on' : 'off'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skeleton */}
                <Card>
                  <CardHeader className='p-4 border-b border-slate-100'>
                    <CardTitle className='text-lg font-normal'>Skeleton</CardTitle>
                  </CardHeader>
                  <CardContent className='p-4 space-y-4'>
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-[250px]' />
                      <Skeleton className='h-4 w-[200px]' />
                      <Skeleton className='h-4 w-[150px]' />
                    </div>

                    <div className='flex items-center space-x-4'>
                      <Skeleton className='h-12 w-12 rounded-full' />
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-[150px]' />
                        <Skeleton className='h-4 w-[100px]' />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Feedback Components */}
          <TabsContent value='feedback'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Alerts */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Alerts</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <Alert variant='default'>
                    <Icons name='IconInfoCircle' className='h-4 w-4' />
                    <div>
                      <div className='font-medium'>Info Alert</div>
                      <div className='text-sm'>This is an informational message.</div>
                    </div>
                  </Alert>

                  <Alert variant='destructive'>
                    <Icons name='IconAlertTriangle' className='h-4 w-4' />
                    <div>
                      <div className='font-medium'>Error Alert</div>
                      <div className='text-sm'>Something went wrong.</div>
                    </div>
                  </Alert>
                </CardContent>
              </Card>

              {/* Toast Messages */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Toast Messages</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div className='grid grid-cols-2 gap-2'>
                    <Button onClick={() => showToast('success')} variant='success'>
                      Success Toast
                    </Button>
                    <Button onClick={() => showToast('error')} variant='danger'>
                      Error Toast
                    </Button>
                    <Button onClick={() => showToast('warning')} variant='warning'>
                      Warning Toast
                    </Button>
                    <Button onClick={() => showToast('info')} variant='secondary'>
                      Info Toast
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {/* Dialogs */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Dialogs</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div className='space-y-2'>
                    <Button onClick={() => setDialogOpen(true)} variant='primary'>
                      Open Dialog
                    </Button>
                    <Dialog
                      isOpen={dialogOpen}
                      onChange={() => setDialogOpen(false)}
                      title='Sample Dialog'
                      description='This is a sample dialog with some content.'
                      onConfirm={() => {
                        setDialogOpen(false);
                        toast.success('Dialog confirmed!');
                      }}
                      onCancel={() => setDialogOpen(false)}
                      confirmText='Confirm'
                      cancelText='Cancel'
                    >
                      <div className='py-4'>
                        <p>This is the dialog content. You can put any content here.</p>
                      </div>
                    </Dialog>
                  </div>

                  <div className='space-y-2'>
                    <Button onClick={() => setAlertDialogOpen(true)} variant='danger'>
                      Open Alert Dialog
                    </Button>
                    <AlertDialog
                      isOpen={alertDialogOpen}
                      onChange={() => setAlertDialogOpen(false)}
                      title='Are you sure?'
                      description='This action cannot be undone. This will permanently delete the item.'
                      onConfirm={() => {
                        setAlertDialogOpen(false);
                        toast.success('Item deleted!');
                      }}
                      onCancel={() => setAlertDialogOpen(false)}
                      confirmText='Delete'
                      cancelText='Cancel'
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tooltip */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Tooltip</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div className='flex flex-wrap gap-4'>
                    <Tooltip content='This is a tooltip on top' side='top'>
                      <Button variant='outline'>Hover me (top)</Button>
                    </Tooltip>

                    <Tooltip content='This is a tooltip on bottom' side='bottom'>
                      <Button variant='outline'>Hover me (bottom)</Button>
                    </Tooltip>

                    <Tooltip content='This is a tooltip on left' side='left'>
                      <Button variant='outline'>Hover me (left)</Button>
                    </Tooltip>

                    <Tooltip content='This is a tooltip on right' side='right'>
                      <Button variant='outline'>Hover me (right)</Button>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Navigation Components */}
          <TabsContent value='navigation'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Tabs */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Tabs</CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                  <Tabs defaultValue='tab1'>
                    <TabsList className='grid w-full grid-cols-3'>
                      <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
                      <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
                      <TabsTrigger value='tab3'>Tab 3</TabsTrigger>
                    </TabsList>
                    <TabsContent value='tab1' className='mt-4'>
                      <div className='p-4 bg-gray-50 rounded-md'>
                        <h3 className='font-medium mb-2'>Tab 1 Content</h3>
                        <p className='text-sm text-gray-600'>
                          This is the content for the first tab.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value='tab2' className='mt-4'>
                      <div className='p-4 bg-gray-50 rounded-md'>
                        <h3 className='font-medium mb-2'>Tab 2 Content</h3>
                        <p className='text-sm text-gray-600'>
                          This is the content for the second tab.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value='tab3' className='mt-4'>
                      <div className='p-4 bg-gray-50 rounded-md'>
                        <h3 className='font-medium mb-2'>Tab 3 Content</h3>
                        <p className='text-sm text-gray-600'>
                          This is the content for the third tab.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Dropdown */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Dropdown</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div className='space-y-2'>
                    <Label>Basic Dropdown:</Label>
                    <Dropdown>
                      <DropdownTrigger asChild>
                        <Button variant='outline'>
                          Open Menu
                          <Icons name='IconChevronDown' className='ml-2 h-4 w-4' />
                        </Button>
                      </DropdownTrigger>
                      <DropdownContent align='start'>
                        <DropdownItem onClick={() => toast.info('Profile clicked')}>
                          <Icons name='IconUser' className='mr-2 h-4 w-4' />
                          Profile
                        </DropdownItem>
                        <DropdownItem onClick={() => toast.info('Settings clicked')}>
                          <Icons name='IconSettings' className='mr-2 h-4 w-4' />
                          Settings
                        </DropdownItem>
                        <DropdownItem onClick={() => toast.info('Help clicked')}>
                          <Icons name='IconHelp' className='mr-2 h-4 w-4' />
                          Help
                        </DropdownItem>
                        <DropdownItem onClick={() => toast.warning('Logout clicked')}>
                          <Icons name='IconLogout' className='mr-2 h-4 w-4' />
                          Logout
                        </DropdownItem>
                      </DropdownContent>
                    </Dropdown>
                  </div>
                </CardContent>
              </Card>

              {/* Accordion */}
              <Card className='lg:col-span-2'>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Accordion</CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                  <Accordion type='single' collapsible className='w-full'>
                    <AccordionItem value='item-1'>
                      <AccordionTrigger>Is it accessible?</AccordionTrigger>
                      <AccordionContent>
                        Yes. It adheres to the WAI-ARIA design pattern and follows accessibility
                        best practices.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='item-2'>
                      <AccordionTrigger>Is it styled?</AccordionTrigger>
                      <AccordionContent>
                        Yes. It comes with default styles that matches the other components'
                        aesthetic.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value='item-3'>
                      <AccordionTrigger>Is it animated?</AccordionTrigger>
                      <AccordionContent>
                        Yes. It's animated by default, but you can disable it if you prefer.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Layout Components */}
          <TabsContent value='layout'>
            <div className='grid grid-cols-1 gap-6'>
              {/* Cards */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Cards</CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    <Card>
                      <CardHeader>
                        <CardTitle>Simple Card</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className='text-sm text-gray-600'>
                          This is a simple card with just text content.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Icons name='IconStar' className='h-5 w-5' />
                          Card with Icon
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className='text-sm text-gray-600'>This card has an icon in the title.</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Interactive Card</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className='text-sm text-gray-600 mb-4'>
                          This card has interactive elements.
                        </p>
                        <div className='flex gap-2'>
                          <Button size='sm' variant='primary'>
                            Action
                          </Button>
                          <Button size='sm' variant='outline'>
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Divider */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Divider</CardTitle>
                </CardHeader>
                <CardContent className='p-4 space-y-4'>
                  <div>
                    <p className='text-sm text-gray-600 mb-2'>Horizontal Divider:</p>
                    <div className='text-center'>Content above</div>
                    <Divider />
                    <div className='text-center'>Content below</div>
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 mb-2'>Divider with Label:</p>
                    <div className='text-center'>Section 1</div>
                    <Divider label='OR' />
                    <div className='text-center'>Section 2</div>
                  </div>

                  <div>
                    <p className='text-sm text-gray-600 mb-2'>Colored Divider:</p>
                    <div className='text-center'>Content above</div>
                    <Divider color='blue' />
                    <div className='text-center'>Content below</div>
                  </div>
                </CardContent>
              </Card>

              {/* Portal Example */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>Portal</CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                  <div className='space-y-4'>
                    <p className='text-sm text-gray-600'>
                      Portal allows rendering components outside the normal component tree. It's
                      commonly used for modals, tooltips, and dropdowns.
                    </p>

                    <div className='p-4 border rounded-md bg-gray-50'>
                      <p className='text-sm'>Normal content in the component tree</p>
                      <Portal>
                        <div className='fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-md shadow-lg z-50'>
                          <p className='text-sm'>This content is rendered via Portal!</p>
                          <p className='text-xs mt-1 opacity-75'>Check the bottom-right corner</p>
                        </div>
                      </Portal>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Complex Example - Dashboard Card */}
              <Card>
                <CardHeader className='p-4 border-b border-slate-100'>
                  <CardTitle className='text-lg font-normal'>
                    Complex Example - Dashboard Widget
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {/* Stats Cards */}
                    <Card className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-gray-600'>Total Users</p>
                          <p className='text-2xl font-bold'>2,847</p>
                        </div>
                        <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
                          <Icons name='IconUsers' className='h-4 w-4 text-blue-600' />
                        </div>
                      </div>
                      <div className='mt-2 flex items-center'>
                        <Badge variant='success'>+12%</Badge>
                        <span className='text-xs text-gray-500 ml-2'>from last month</span>
                      </div>
                    </Card>

                    <Card className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-gray-600'>Revenue</p>
                          <p className='text-2xl font-bold'>$24,571</p>
                        </div>
                        <div className='h-8 w-8 bg-green-100 rounded-full flex items-center justify-center'>
                          <Icons name='IconCurrencyDollar' className='h-4 w-4 text-green-600' />
                        </div>
                      </div>
                      <div className='mt-2 flex items-center'>
                        <Badge variant='success'>+8%</Badge>
                        <span className='text-xs text-gray-500 ml-2'>from last month</span>
                      </div>
                    </Card>

                    <Card className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-gray-600'>Orders</p>
                          <p className='text-2xl font-bold'>1,423</p>
                        </div>
                        <div className='h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center'>
                          <Icons name='IconShoppingCart' className='h-4 w-4 text-orange-600' />
                        </div>
                      </div>
                      <div className='mt-2 flex items-center'>
                        <Badge variant='warning'>-3%</Badge>
                        <span className='text-xs text-gray-500 ml-2'>from last month</span>
                      </div>
                    </Card>

                    <Card className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <p className='text-sm font-medium text-gray-600'>Conversion</p>
                          <p className='text-2xl font-bold'>3.2%</p>
                        </div>
                        <div className='h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center'>
                          <Icons name='IconTrendingUp' className='h-4 w-4 text-purple-600' />
                        </div>
                      </div>
                      <div className='mt-2 flex items-center'>
                        <Badge variant='success'>+0.5%</Badge>
                        <span className='text-xs text-gray-500 ml-2'>from last month</span>
                      </div>
                    </Card>
                  </div>

                  {/* Activity Feed */}
                  <Card className='mt-6'>
                    <CardHeader className='pb-3'>
                      <CardTitle className='text-base'>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                      {[
                        {
                          action: 'New user registered',
                          time: '2 minutes ago',
                          icon: 'IconUserPlus',
                          color: 'blue'
                        },
                        {
                          action: 'Order #1234 completed',
                          time: '5 minutes ago',
                          icon: 'IconCheck',
                          color: 'green'
                        },
                        {
                          action: 'Payment received',
                          time: '10 minutes ago',
                          icon: 'IconCreditCard',
                          color: 'purple'
                        },
                        {
                          action: 'Support ticket created',
                          time: '15 minutes ago',
                          icon: 'IconMessageCircle',
                          color: 'orange'
                        }
                      ].map((item, index) => (
                        <div
                          key={index}
                          className='flex items-center gap-3 p-2 rounded-md hover:bg-gray-50'
                        >
                          <div
                            className={`h-8 w-8 bg-${item.color}-100 rounded-full flex items-center justify-center`}
                          >
                            <Icons
                              name={item.icon as any}
                              className={`h-4 w-4 text-${item.color}-600`}
                            />
                          </div>
                          <div className='flex-1'>
                            <p className='text-sm font-medium'>{item.action}</p>
                            <p className='text-xs text-gray-500'>{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Page>

      {/* Toast Container */}
      <ToastContainer position='top-right' />
    </ToastProvider>
  );
};
