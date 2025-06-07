import React, { useState } from 'react';

import { Button, Icons, Card, Badge } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { usePopularTemplates, useTemplatesByCategory } from '../service';
import { ContentTemplate } from '../template';

import { Page, Topbar } from '@/components/layout';

export const TemplateMarketPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: popularTemplates } = usePopularTemplates(undefined, 6);
  const { data: categoryTemplates } = useTemplatesByCategory(
    selectedCategory !== 'all' ? selectedCategory : ''
  );

  const categories = [
    { key: 'all', label: t('common.all'), icon: 'IconGrid' },
    { key: 'blog', label: t('template.categories.blog'), icon: 'IconFileText' },
    { key: 'news', label: t('template.categories.news'), icon: 'IconCalendar' },
    { key: 'marketing', label: t('template.categories.marketing'), icon: 'IconMegaphone' },
    { key: 'documentation', label: t('template.categories.documentation'), icon: 'IconBook' },
    { key: 'ecommerce', label: t('template.categories.ecommerce'), icon: 'IconShoppingCart' },
    { key: 'portfolio', label: t('template.categories.portfolio'), icon: 'IconBriefcase' }
  ];

  const templates =
    selectedCategory === 'all' ? popularTemplates?.items || [] : categoryTemplates?.items || [];

  const handleInstallTemplate = async (template: ContentTemplate) => {
    try {
      // Install template logic
      console.log('Installing template:', template.id);
      // Redirect to create content with template
      navigate(`/content/topics/create?template=${template.id}`);
    } catch (error) {
      console.error('Failed to install template:', error);
    }
  };

  return (
    <Page
      sidebar
      title={t('template.market.title')}
      topbar={
        <Topbar
          title={t('template.market.title')}
          left={[
            <span className='text-muted-foreground text-xs'>
              {t('template.market.description')}
            </span>
          ]}
          right={[
            <Button onClick={() => navigate('/content/templates/create')} size='sm'>
              <Icons name='IconPlus' size={16} className='mr-2' />
              {t('template.create.action')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Categories */}
      <div className='flex space-x-2 overflow-x-auto pb-2'>
        {categories.map(category => (
          <Button
            key={category.key}
            variant={selectedCategory === category.key ? 'default' : 'outline'}
            size='sm'
            onClick={() => setSelectedCategory(category.key)}
            className='flex items-center space-x-2 whitespace-nowrap'
          >
            <Icons name={category.icon} size={16} />
            <span>{category.label}</span>
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {templates.map((template: ContentTemplate) => (
          <Card key={template.id} className='p-6 hover:shadow-lg transition-shadow'>
            <div className='space-y-4'>
              {/* Template Preview */}
              <div className='h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
                <Icons name='IconTemplate' size={32} className='text-white' />
              </div>

              {/* Template Info */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <h3 className='font-semibold text-gray-900'>{template.name}</h3>
                  <Badge variant='primary' className='text-xs'>
                    {t(`template.types.${template.type}`)}
                  </Badge>
                </div>
                <p className='text-sm text-gray-600 line-clamp-2'>{template.description}</p>
              </div>

              {/* Template Stats */}
              <div className='flex items-center justify-between text-sm text-gray-500'>
                <div className='flex items-center space-x-1'>
                  <Icons name='IconDownload' size={14} />
                  <span>{template.usage_count}</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <Icons name='IconUser' size={14} />
                  <span>{template.author_id}</span>
                </div>
              </div>

              {/* Actions */}
              <div className='flex space-x-2'>
                <Button
                  size='sm'
                  className='flex-1'
                  onClick={() => handleInstallTemplate(template)}
                >
                  <Icons name='IconDownload' size={14} className='mr-1' />
                  {t('template.actions.install')}
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => navigate(`/content/templates/${template.id}`)}
                >
                  <Icons name='IconEye' size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {templates.length === 0 && (
        <Card className='text-center py-12'>
          <Icons name='IconStore' size={48} className='mx-auto text-gray-400 mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {t('template.market.no_templates')}
          </h3>
          <p className='text-gray-500'>{t('template.market.no_templates_desc')}</p>
        </Card>
      )}
    </Page>
  );
};
