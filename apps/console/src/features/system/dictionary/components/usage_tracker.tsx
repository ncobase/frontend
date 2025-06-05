import { useState, useEffect } from 'react';

import { Badge } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { getDictionaryUsage } from '../apis';

export const DictionaryUsageTracker: React.FC<{ dictionaryId: string }> = ({ dictionaryId }) => {
  const { t } = useTranslation();
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDictionaryUsage();
  }, [dictionaryId]);

  const loadDictionaryUsage = async () => {
    try {
      setLoading(true);
      const usageData = await getDictionaryUsage(dictionaryId);
      setUsage(usageData);
    } catch (error) {
      console.error('Failed to load dictionary usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className='text-center py-4'>{t('common.loading')}</div>;
  }

  return (
    <div className='space-y-3'>
      <h4 className='font-medium'>{t('dictionary.usage.title')}</h4>
      {usage.length === 0 ? (
        <div className='text-slate-500 text-sm'>{t('dictionary.usage.no_usage')}</div>
      ) : (
        <div className='space-y-2'>
          {usage.map((item, index) => (
            <div key={index} className='flex items-center justify-between p-2 bg-slate-50 rounded'>
              <div>
                <div className='font-medium text-sm'>{item.module}</div>
                <div className='text-xs text-slate-600'>{item.location}</div>
              </div>
              <Badge variant='outline-primary' size='xs'>
                {item.count}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
