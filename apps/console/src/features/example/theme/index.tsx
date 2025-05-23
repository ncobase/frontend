import { useState, useEffect } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icons,
  TableView,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { Page, Topbar } from '@/components/layout';

export const ThemeSwitcherExample = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setThemeMode = mode => {
    setTheme(mode);
  };

  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-system');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const topbarElement = {
    title: t('example.theme.title'),
    right: [
      <div className='flex items-center gap-x-2'>
        <Button variant='unstyle' size='ratio' className='p-1.5' onClick={toggleTheme}>
          <Icons name={theme === 'light' ? 'IconMoon' : 'IconSun'} />
        </Button>
        <Select value={theme} onValueChange={setThemeMode}>
          <SelectTrigger className='w-[140px]'>
            <SelectValue placeholder={t('example.theme.selectTheme')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='light'>{t('example.theme.lightMode')}</SelectItem>
            <SelectItem value='dark'>{t('example.theme.darkMode')}</SelectItem>
            <SelectItem value='system'>{t('example.theme.systemMode')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ]
  };

  const topbar = <Topbar {...topbarElement} />;

  return (
    <Page sidebar topbar={topbar} className={`${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className='p-4 space-y-6'>
        <h2
          className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
        >
          {t('example.theme.heading')}
        </h2>

        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={`text-lg font-normal ${theme === 'dark' ? 'text-white' : ''}`}>
              {t('example.theme.currentTheme')}:{' '}
              {theme === 'light' ? t('example.theme.lightMode') : t('example.theme.darkMode')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200'}`}
            >
              <p>{t('example.theme.description')}</p>
            </div>

            <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
                  {t('example.theme.sampleButtons')}
                </h3>
                <div className='space-y-2'>
                  <Button variant='primary'>{t('actions.primary')}</Button>
                  <Button variant='secondary'>{t('actions.secondary')}</Button>
                  <Button variant='outline-primary'>{t('actions.outline')}</Button>
                </div>
              </div>

              <div>
                <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
                  {t('example.theme.sampleForm')}
                </h3>
                <div className='space-y-2'>
                  <label
                    className={`block font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
                  >
                    {t('example.i18n.username')}
                  </label>
                  <input
                    type='text'
                    className={`w-full p-2 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                    }`}
                    placeholder={t('example.i18n.enterUsername')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={`text-lg font-normal ${theme === 'dark' ? 'text-white' : ''}`}>
              {t('example.theme.themeTable')}
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <TableView
              className={theme === 'dark' ? 'dark-table' : ''}
              header={[
                { title: t('example.i18n.name'), accessorKey: 'name' },
                { title: t('example.i18n.role'), accessorKey: 'role' },
                { title: t('example.i18n.status'), accessorKey: 'status' },
                { title: 'Progress', accessorKey: 'progress' },
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
                  status: t('example.i18n.active'),
                  progress: '65%'
                },
                {
                  id: 2,
                  name: t('example.i18n.sampleName2'),
                  role: t('example.i18n.designer'),
                  status: t('example.i18n.active'),
                  progress: '100%'
                },
                {
                  id: 3,
                  name: t('example.i18n.sampleName3'),
                  role: t('example.i18n.manager'),
                  status: t('example.i18n.inactive'),
                  progress: '10%'
                },
                {
                  id: 4,
                  name: 'Alex Wilson',
                  role: t('example.i18n.developer'),
                  status: t('example.i18n.active'),
                  progress: '45%'
                }
              ]}
            />
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {['primary', 'secondary', 'success', 'warning', 'danger'].map((color: any) => (
            <Card key={color} className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle
                  className={`text-lg font-normal capitalize ${theme === 'dark' ? 'text-white' : ''}`}
                >
                  {color}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <Button variant={color} className='w-full'>
                    {t('actions.button')}
                  </Button>
                  {/* @ts-expect-error */}
                  <Button variant={`outline-${color}`} className='w-full'>
                    {t('actions.outline')}
                  </Button>
                  <div
                    className={`p-4 rounded-sm bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-200`}
                  >
                    {t('example.theme.content')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
};
