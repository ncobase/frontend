import React, { useState } from 'react';

import {
  Button,
  Container,
  DatePicker,
  FieldConfigProps,
  Form,
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
  TabsTrigger
} from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useListMenus } from '@/features/system/menu/service';
import { Page } from '@/layout';
import { ExplicitAny } from '@/types';

export const CreatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [queryKey] = useState({});
  const { menus } = useListMenus(queryKey);

  const fields: FieldConfigProps[] = [
    {
      title: '用户名',
      name: 'user.username',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconUser',
      rules: {
        required: t('fields.username.required'),
        validate: value => {
          if (value && !/^[a-zA-Z0-9_]*$/i.test(value)) {
            return t('fields.username.invalid');
          } else if (value && value.length < 6) {
            return t('fields.username.too_short', { count: 6 });
          } else if (value && value.length > 30) {
            return t('fields.username.too_long', { count: 30 });
          }
        }
      }
    },
    {
      title: '密码',
      name: 'user.password',
      defaultValue: '',
      type: 'password',
      prependIcon: 'IconLock',
      rules: {
        required: t('fields.password.required'),
        validate: value => {
          if (value && value.length < 8) {
            return t('fields.password.too_short', { count: 8 });
          } else if (value && value.length > 128) {
            return t('fields.password.too_long', { count: 128 });
          } else if (value && !/[A-Z]/.test(value)) {
            return t('fields.password.missing_uppercase');
          } else if (value && !/[a-z]/.test(value)) {
            return t('fields.password.missing_lowercase');
          } else if (value && !/[0-9]/.test(value)) {
            return t('fields.password.missing_number');
          } else if (value && !/[^A-Za-z0-9]/.test(value)) {
            return t('fields.password.missing_symbol');
          }
        }
      }
    },
    {
      title: '邮箱',
      name: 'user.email',
      defaultValue: '',
      type: 'email',
      prependIcon: 'IconMail',
      rules: {
        required: t('fields.email.required'),
        validate: value => {
          if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            return t('fields.email.invalid');
          }
        }
      }
    },
    {
      title: '手机',
      name: 'user.phone',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconPhone',
      rules: {
        validate: value => {
          if (value && !/^1[3-9]\d{9}$/.test(value)) {
            return '手机号格式不正确';
          }
        }
      }
    },
    {
      title: '姓',
      name: 'profile.first_name',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconUser'
    },
    {
      title: '名',
      name: 'profile.last_name',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconUser'
    },
    {
      title: '性别',
      name: 'profile.gender',
      defaultValue: '0',
      type: 'select',
      options: [
        { label: '男', value: '0' },
        { label: '女', value: '1' }
      ],
      rules: { required: '请选择性别' }
    },
    {
      title: '所属职务（可多选）',
      name: 'profile.roles',
      type: 'checkbox',
      defaultValue: [],
      className: 'col-span-full',
      options: [
        { label: '总经理', value: '1' },
        { label: '项目经理', value: '2' },
        { label: '项目主管', value: '3' },
        { label: '项目成员', value: '4' },
        { label: '其他', value: '5' }
      ],
      elementClassName: 'py-3.5',
      rules: { required: '请选择所属职务（可多选）' }
    },
    {
      title: '状态',
      name: 'user.status',
      defaultValue: '0',
      type: 'select',
      options: [
        { label: '激活', value: '0' },
        { label: '未激活', value: '1' },
        { label: '禁用', value: '2' }
      ],
      rules: { required: t('forms.select_required') }
    },
    {
      title: '生日',
      name: 'profile.birthday',
      defaultValue: new Date(),
      type: 'date',
      rules: { required: t('forms.select_required') }
    },
    {
      title: '在职周期',
      name: 'profile.working_period',
      defaultValue: { from: new Date(), to: new Date() },
      type: 'date-range',
      rules: { required: t('forms.select_required') }
    },
    {
      title: '同意协议',
      name: 'user.agree_agreement',
      type: 'radio',
      className: 'col-span-full',
      rules: { required: t('forms.select_required') },
      elementClassName: 'py-3'
    },
    {
      title: '真实姓名',
      name: 'fullname',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconUser',
      rules: { required: t('forms.input_required') }
    },
    {
      title: '邮箱',
      name: 'email',
      defaultValue: '',
      type: 'email',
      prependIcon: 'IconMail'
    },
    {
      title: '您的活动什么时候举行？',
      name: 'event.date',
      defaultValue: new Date(),
      type: 'date'
    },
    {
      title: '活动类型',
      name: 'event.type',
      defaultValue: '',
      type: 'select',
      prependIcon: 'IconCategory',
      options: [
        { label: '企业活动', value: 'corporate' },
        { label: '婚礼', value: 'wedding' },
        { label: '生日派对', value: 'birthday' },
        { label: '其它', value: 'other' }
      ]
    },
    {
      title: '其它细节',
      defaultValue: '',
      name: 'event.description',
      type: 'textarea',
      className: 'col-span-full'
    },
    {
      title: '所属组织',
      name: 'profile.organization',
      type: 'radio',
      defaultValue: '1',
      options: [
        { label: '组织 1', value: '1' },
        { label: '组织 2', value: '2' },
        { label: '组织 3', value: '3' }
      ],
      elementClassName: 'py-2.5',
      rules: { required: t('forms.select_required') }
    },
    {
      className: 'py-2.5',
      name: 'notification',
      type: 'checkbox',
      elementClassName: 'py-3.5',
      options: [{ label: '通过邮件获取通知', value: '1' }]
    },
    {
      title: '关于',
      defaultValue: '',
      name: 'profile.about',
      type: 'textarea',
      className: 'col-span-full'
    }
  ];

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (formData: ExplicitAny) => {
    console.log(formData);
  };

  return (
    <Page layout={false}>
      <div className='h-16 shadow-sm bg-white sticky top-0 right-0 left-0'>
        <Container className='max-w-7xl bg-white'>
          <div className='flex items-center justify-center'>
            <div className='flex-1 flex items-center gap-x-4'>
              <Button variant='outline-slate' onClick={() => navigate(-1)}>
                <Icons name='IconArrowLeft' />
              </Button>
              <div className='text-slate-600 font-medium'>创建表单</div>
            </div>
            <div className='flex gap-x-4'>
              <Button variant='outline-slate' onClick={() => navigate(-1)}>
                {t('actions.cancel')}
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>{t('actions.submit')}</Button>
            </div>
          </div>
        </Container>
      </div>
      <ScrollView className='py-4'>
        <Container className='max-w-7xl bg-white'>
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
              <Form
                onSubmit={handleSubmit(onSubmit)}
                control={control}
                errors={errors}
                fields={fields}
              />
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
                    code: 'id',
                    parser: (value: string) => (
                      <Button variant='link' size='sm' onClick={() => navigate(`viewer/${value}`)}>
                        {value}
                      </Button>
                    ),
                    icon: 'IconHash'
                  },
                  {
                    title: 'Name',
                    code: 'name',
                    parser: (value: string) => (
                      <Input type='text' defaultValue={value} className='py-1.5' />
                    ),
                    icon: 'IconFlame'
                  },
                  {
                    title: 'Slug',
                    code: 'slug',
                    icon: 'IconProgress'
                  },
                  {
                    title: 'Path',
                    code: 'path',
                    parser: (value: string) => (
                      <Input type='text' defaultValue={value} className='py-1.5' />
                    ),
                    icon: 'IconRoute'
                  },
                  {
                    title: 'Icon',
                    code: 'icon',
                    parser: (value: string) => <Icons name={value} size={16} />,
                    icon: 'IconCategory'
                  },
                  {
                    title: 'Status',
                    code: 'disabled',
                    parser: (value: string) => {
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
                    code: 'created_at',
                    parser: (value: string) => <DatePicker defaultValue={value} />,
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
          <div></div>
        </Container>
      </ScrollView>
    </Page>
  );
};
