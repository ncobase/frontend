import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableView
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useLanguageSwitcher } from '@/hooks/use_language_switcher';
import { Page, Topbar } from '@/layout';

export const I18nExample = () => {
  const { t } = useTranslation();
  const { currentLanguage, switchLanguage, availableLanguages } = useLanguageSwitcher();

  const topbarElement = {
    title: t('example.i18n.title'),
    right: [
      <div className='flex items-center gap-x-2'>
        <Select value={currentLanguage.key} onValueChange={switchLanguage}>
          <SelectTrigger className='w-[160px]'>
            <SelectValue>
              <div className='flex items-center'>
                <span className='mr-2'>{currentLanguage.flag}</span>
                <span>{currentLanguage.name}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map(lang => (
              <SelectItem key={lang.key} value={lang.key}>
                <div className='flex items-center'>
                  <span className='mr-2'>{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ]
  };

  const topbar = <Topbar {...topbarElement} />;

  return (
    <Page sidebar topbar={topbar}>
      <div className='p-4 space-y-6'>
        <h2 className='text-xl font-semibold mb-4'>{t('example.i18n.heading')}</h2>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-normal'>
              {t('example.i18n.currentLanguage')}: {currentLanguage.name} {currentLanguage.flag}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='mb-4'>{t('example.i18n.description')}</p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <h3 className='font-medium'>{t('example.i18n.buttonExamples')}</h3>
                <div className='space-x-2'>
                  <Button variant='primary'>{t('actions.create')}</Button>
                  <Button variant='secondary'>{t('actions.edit')}</Button>
                  <Button variant='danger'>{t('actions.delete')}</Button>
                </div>
              </div>

              <div className='space-y-2'>
                <h3 className='font-medium'>{t('example.i18n.formExamples')}</h3>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>{t('example.i18n.username')}</label>
                  <input
                    type='text'
                    className='w-full p-2 border border-gray-300 rounded-md'
                    placeholder={t('example.i18n.enterUsername')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-normal'>{t('example.i18n.tableExample')}</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <TableView
              header={[
                { title: t('example.i18n.name'), code: 'name' },
                { title: t('example.i18n.role'), code: 'role' },
                { title: t('example.i18n.department'), code: 'department' },
                { title: t('example.i18n.status'), code: 'status' },
                {
                  title: t('example.i18n.operations'),
                  code: 'operation-column',
                  actions: [
                    {
                      title: t('actions.view'),
                      icon: 'IconEye',
                      onClick: () => console.log('view')
                    },
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
                }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-normal'>
              {t('example.i18n.dateFormatting')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <h3 className='font-medium mb-2'>{t('example.i18n.currentDate')}</h3>
                <p>{new Date().toLocaleDateString(currentLanguage.key)}</p>
              </div>

              <div>
                <h3 className='font-medium mb-2'>{t('example.i18n.currentDateTime')}</h3>
                <p>{new Date().toLocaleString(currentLanguage.key)}</p>
              </div>

              <div>
                <h3 className='font-medium mb-2'>{t('example.i18n.currencyFormat')}</h3>
                <p>
                  {new Intl.NumberFormat(currentLanguage.key, {
                    style: 'currency',
                    currency:
                      currentLanguage.key === 'zh'
                        ? 'CNY'
                        : currentLanguage.key === 'ja'
                          ? 'JPY'
                          : currentLanguage.key === 'ko'
                            ? 'KRW'
                            : 'USD'
                  }).format(1234.56)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};
