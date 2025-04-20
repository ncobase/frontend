import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Icons,
  Label,
  TableView
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { Page, Topbar } from '@/components/layout';

export const ResponsiveDesignExample = () => {
  const { t } = useTranslation();

  const topbarElement = {
    title: t('example.responsive.title'),
    left: [
      <Button variant='primary' className='sm:block hidden'>
        <Icons name='IconPlus' className='mr-2' /> {t('actions.create')}
      </Button>,
      <Button variant='primary' className='sm:hidden block' size='sm'>
        <Icons name='IconPlus' />
      </Button>
    ]
  };

  const topbar = <Topbar {...topbarElement} />;

  return (
    <Page sidebar topbar={topbar}>
      <div className='p-4'>
        <h2 className='text-xl font-semibold mb-4'>{t('example.responsive.heading')}</h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8'>
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className='flex flex-col'>
                <CardHeader>
                  <CardTitle className='text-lg font-normal flex justify-between'>
                    <span>
                      {t('example.responsive.title')} #{i + 1}
                    </span>
                    <span className='sm:inline hidden'>
                      <Icons name='IconSquareRoundedCheck' className='stroke-success-400' />
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex-1 flex items-center justify-center p-6'>
                  <div className='text-center'>
                    <div className='hidden sm:block text-slate-500'>
                      <Icons name='IconDeviceDesktop' size={48} />
                    </div>
                    <div className='sm:hidden block text-slate-500'>
                      <Icons name='IconDeviceMobile' size={48} />
                    </div>
                    <p className='mt-2 text-slate-600'>
                      {window.innerWidth <= 640
                        ? t('example.responsive.mobileView')
                        : t('example.responsive.desktopView')}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className='justify-between'>
                  <div className='text-slate-500'>
                    <span className='hidden md:inline'>
                      {t('example.responsive.lastUpdated')}: 2025-04-10
                    </span>
                    <span className='md:hidden'>2025-04-10</span>
                  </div>
                  <div className='flex gap-2'>
                    <Button variant='outline-slate' size='sm' className='hidden sm:flex'>
                      <Icons name='IconPencil' size={16} className='mr-1' />
                      {t('actions.edit')}
                    </Button>
                    <Button variant='outline-slate' size='sm' className='sm:hidden'>
                      <Icons name='IconPencil' size={16} />
                    </Button>
                    <Button variant='primary' size='sm' className='hidden sm:flex'>
                      {t('actions.view')}
                    </Button>
                    <Button variant='primary' size='sm' className='sm:hidden'>
                      <Icons name='IconEye' size={16} />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>

        <Card className='mb-8'>
          <CardHeader>
            <CardTitle className='text-lg font-normal'>
              {t('example.responsive.responsiveTable')}
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <TableView
              header={[
                { title: t('example.i18n.name'), accessorKey: 'name' },
                { title: t('example.i18n.role'), accessorKey: 'role' },
                { title: t('example.i18n.department'), accessorKey: 'department' },
                { title: t('example.i18n.status'), accessorKey: 'status' },
                {
                  title: t('example.i18n.operations'),
                  accessorKey: 'operation-column',
                  actions: [
                    {
                      title: t('actions.edit'),
                      icon: 'IconPencil',
                      onClick: () => console.log('edit')
                    },
                    {
                      title: t('actions.delete'),
                      icon: 'IconTrash',
                      onClick: () => console.log('delete')
                    }
                  ]
                }
              ]}
              data={[
                {
                  id: 1,
                  name: t('example.i18n.sampleName1'),
                  role: t('example.i18n.developer'),
                  department: t('example.i18n.techDept'),
                  status: t('example.i18n.active')
                },
                {
                  id: 2,
                  name: t('example.i18n.sampleName2'),
                  role: t('example.i18n.designer'),
                  department: t('example.i18n.designDept'),
                  status: t('example.i18n.active')
                },
                {
                  id: 3,
                  name: t('example.i18n.sampleName3'),
                  role: t('example.i18n.manager'),
                  department: t('example.i18n.marketingDept'),
                  status: t('example.i18n.inactive')
                },
                {
                  id: 4,
                  name: 'Alex Wilson',
                  role: t('example.i18n.developer'),
                  department: t('example.i18n.techDept'),
                  status: t('example.i18n.active')
                }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-normal'>
              {t('example.responsive.responsiveForm')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>{t('example.i18n.username')}</label>
                  <input
                    type='text'
                    className='w-full p-2 border border-slate-300 rounded-md'
                    placeholder={t('example.i18n.enterUsername')}
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-sm font-medium'>Email</Label>
                  <input
                    type='email'
                    className='w-full p-2 border border-slate-300 rounded-md'
                    placeholder='email@example.com'
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>{t('example.i18n.role')}</label>
                  <input
                    type='text'
                    className='w-full p-2 border border-slate-300 rounded-md'
                    placeholder={t('example.i18n.role')}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium'>{t('example.i18n.department')}</label>
                <input
                  type='text'
                  className='w-full p-2 border border-slate-300 rounded-md'
                  placeholder={t('example.i18n.department')}
                />
              </div>
              <div className='flex flex-col sm:flex-row justify-end gap-2'>
                <Button variant='outline-slate'>{t('actions.cancel')}</Button>
                <Button variant='primary'>{t('actions.submit')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};
