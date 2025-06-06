import { useState } from 'react';

import {
  Button,
  Checkbox,
  Container,
  DatePicker,
  Icons,
  Input,
  Label,
  ScrollView,
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
  Textarea
} from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Page } from '@/components/layout';
import { useListMenus } from '@/features/system/menu/service';
import { useCurrentTime } from '@/hooks/use_current_time';

export const EditorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryParams] = useState({ limit: 20 });
  const { data } = useListMenus(queryParams);
  const menus = data?.items || [];

  const { currentTime } = useCurrentTime();

  return (
    <Page layout={false}>
      <div className='h-16 shadow-xs bg-white sticky top-0 right-0 left-0'>
        <Container className='max-w-7xl'>
          <div className='flex items-center justify-center'>
            <div className='flex-1 flex items-center gap-x-4'>
              <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
                <Icons name='IconArrowLeft' />
              </Button>
              <div className='text-slate-600 font-medium'>编辑表单</div>
            </div>
            <div className='flex gap-x-4'>
              <Button variant='outline-slate' onClick={() => navigate(-1)} size='sm'>
                {t('actions.cancel')}
              </Button>
              <Button size='sm'>{t('actions.submit')}</Button>
            </div>
          </div>
        </Container>
      </div>
      <ScrollView className='py-4'>
        <Container className='max-w-7xl'>
          <Tabs defaultValue='contracts'>
            <TabsList className='flex items-center justify-end gap-x-4'>
              <TabsTrigger
                value='contracts'
                className='data-[state=active]:border-primary-500 data-[state=active]:text-primary-500'
              >
                合同信息
              </TabsTrigger>
              <TabsTrigger
                value='material'
                className='data-[state=active]:border-red-500 data-[state=active]:text-red-500'
              >
                物料信息
              </TabsTrigger>
              <TabsTrigger
                value='customers'
                className='data-[state=active]:border-green-500 data-[state=active]:text-green-500'
              >
                客户信用
              </TabsTrigger>
            </TabsList>
            <TabsContent value='contracts' className='py-4'>
              <div className='grid grid-cols-3 gap-4'>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Email address</Label>
                  <Input type='email' placeholder='john@example.com' />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>When is your event?</Label>
                  <DatePicker defaultValue={currentTime} />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>What type of event is it?</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='What type of event is it?' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Corporate event'>Corporate event</SelectItem>
                      <SelectItem value='Wedding'>Wedding</SelectItem>
                      <SelectItem value='Birthday'>Birthday</SelectItem>
                      <SelectItem value='Other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex flex-col col-span-2 gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='file' placeholder='' />
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <Textarea rows={8}></Textarea>
                </div>
                <div className='flex flex-col col-span-2 gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' disabled placeholder='' />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <Textarea rows={8}></Textarea>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <Textarea rows={3}></Textarea>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Email address</Label>
                  <Input type='email' placeholder='john@example.com' />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>When is your event?</Label>
                  <DatePicker defaultValue={currentTime} />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>What type of event is it?</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='What type of event is it?' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Corporate event'>Corporate event</SelectItem>
                      <SelectItem value='Wedding'>Wedding</SelectItem>
                      <SelectItem value='Birthday'>Birthday</SelectItem>
                      <SelectItem value='Other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex flex-col col-span-2 gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <Textarea rows={8}></Textarea>
                </div>
                <div className='flex flex-col col-span-2 gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <Textarea rows={5}></Textarea>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <Textarea rows={8}></Textarea>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Email address</Label>
                  <Input type='email' placeholder='john@example.com' />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>When is your event?</Label>
                  <DatePicker defaultValue={currentTime} />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>What type of event is it?</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='What type of event is it?' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Corporate event'>Corporate event</SelectItem>
                      <SelectItem value='Wedding'>Wedding</SelectItem>
                      <SelectItem value='Birthday'>Birthday</SelectItem>
                      <SelectItem value='Other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='flex flex-col col-span-2 gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <Textarea rows={8}></Textarea>
                </div>
                <div className='flex flex-col col-span-2 gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <Textarea rows={8}></Textarea>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <Input type='text' placeholder='' />
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <Textarea rows={8}></Textarea>
                </div>
                <div className='col-span-full inline-flex items-center'>
                  <Checkbox id='hs-default-checkbox' defaultChecked />
                  <Label className='pl-2' htmlFor='hs-default-checkbox'>
                    Email me news and special offers
                  </Label>
                </div>
              </div>
            </TabsContent>
            <TabsContent value='material' className='py-4'>
              <TableView
                className='mt-4'
                data={menus}
                pageSize={10}
                selected
                visibleControl
                header={[
                  {
                    title: 'ID',
                    dataIndex: 'id',
                    parser: value => (
                      <Button variant='link' size='sm' onClick={() => navigate(`viewer/${value}`)}>
                        {value}
                      </Button>
                    ),
                    icon: 'IconHash'
                  },
                  {
                    title: 'Name',
                    dataIndex: 'name',
                    parser: value => <Input type='text' defaultValue={value} className='py-1.5' />,
                    icon: 'IconFlame'
                  },
                  {
                    title: 'Slug',
                    dataIndex: 'slug',
                    parser: value => <Input type='text' defaultValue={value} className='py-1.5' />,
                    icon: 'IconAffiliate'
                  },
                  {
                    title: 'Path',
                    dataIndex: 'path',
                    icon: 'IconRoute'
                  },
                  {
                    title: 'Icon',
                    dataIndex: 'icon',
                    parser: value => <Icons name={value} size={16} />,
                    icon: 'IconCategory'
                  },
                  {
                    title: 'Status',
                    dataIndex: 'disabled',
                    parser: value => {
                      value = value ? '1' : '0';
                      return (
                        <Select defaultValue={value}>
                          <SelectTrigger className='py-1.5 bg-slate-50'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={'0'}>禁用</SelectItem>
                            <SelectItem value={'1'}>启用</SelectItem>
                          </SelectContent>
                        </Select>
                      );
                    },
                    icon: 'IconFlagCog'
                  },
                  {
                    title: 'Created At',
                    dataIndex: 'created_at',
                    parser: value => formatDateTime(value),
                    icon: 'IconCalendarMonth'
                  }
                ]}
              />
            </TabsContent>
            <TabsContent value='customers' className='py-4'>
              <div className='grid grid-cols-3 gap-4'>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Email address</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>When is your event?</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>What type of event is it?</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容
                  </div>
                </div>
                <div className='flex flex-col col-span-2 gap-y-1'>
                  <Label>Full name</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容字段内容
                  </div>
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col col-span-2 gap-y-1'>
                  <Label>Full name</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='col-span-full flex flex-col gap-y-1'>
                  <Label>Additional details</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Full name</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>Email address</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>When is your event?</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    字段内容
                  </div>
                </div>
                <div className='flex flex-col gap-y-1'>
                  <Label>What type of event is it?</Label>
                  <div className='border-b border-slate-100 py-2.5 max-h-16 overflow-auto w-full inline-block text-slate-600'>
                    Corporate event
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </ScrollView>
    </Page>
  );
};
