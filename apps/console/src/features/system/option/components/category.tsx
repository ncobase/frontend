import { useState, useEffect } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

export const OptionCategory: React.FC = () => {
  const { t } = useTranslation();
  const [, setEditingCategory] = useState(null);
  const [, setShowCategoryForm] = useState(false);

  const predefinedCategories = [
    { key: 'general', name: t('options.categories.general'), icon: 'IconSettings' },
    { key: 'security', name: t('options.categories.security'), icon: 'IconShield' },
    { key: 'email', name: t('options.categories.email'), icon: 'IconMail' },
    { key: 'ui', name: t('options.categories.ui'), icon: 'IconPalette' },
    { key: 'performance', name: t('options.categories.performance'), icon: 'IconGauge' },
    { key: 'integrations', name: t('options.categories.integrations'), icon: 'IconPlug' },
    { key: 'backup', name: t('options.categories.backup'), icon: 'IconDatabase' }
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {predefinedCategories.map(category => (
        <OptionsCategoryCard
          key={category.key}
          category={category}
          onEdit={() => setEditingCategory(category)}
        />
      ))}

      <div className='border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center'>
        <Icons name='IconPlus' className='w-8 h-8 text-slate-400 mb-2' />
        <Button variant='outline-primary' onClick={() => setShowCategoryForm(true)}>
          {t('options.categories.add_custom')}
        </Button>
      </div>
    </div>
  );
};

const OptionsCategoryCard = ({ category, onEdit }) => {
  const { t } = useTranslation();
  const [optionsCount, setOptionsCount] = useState(0);

  useEffect(() => {
    const loadCategoryOptionsCount = async (categoryKey: string) => {
      const mockCounts = {
        general: 12,
        security: 8,
        email: 5,
        ui: 10,
        performance: 6,
        integrations: 4,
        backup: 3
      };
      setOptionsCount(mockCounts[categoryKey] || 0);
    };

    loadCategoryOptionsCount(category.key);
  }, [category.key]);

  return (
    <div className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center space-x-3'>
          <Icons name={category.icon} className='w-5 h-5 text-slate-500' />
          <span className='font-medium'>{category.name}</span>
        </div>
        <Button variant='ghost' size='xs' onClick={onEdit}>
          <Icons name='IconPencil' size={14} />
        </Button>
      </div>

      <div className='text-sm text-slate-600 mb-3'>
        {t('options.categories.options_count', { count: optionsCount })}
      </div>

      <Button variant='outline-primary' size='sm' className='w-full'>
        {t('options.categories.manage')}
      </Button>
    </div>
  );
};
