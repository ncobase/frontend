import React from 'react';

import { Card, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { SEOData } from '../seo';

interface SEOPreviewProps {
  seoData: Partial<SEOData>;
}

export const SEOPreview: React.FC<SEOPreviewProps> = ({ seoData }) => {
  const { t } = useTranslation();

  const truncate = (text: string, length: number) => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  return (
    <Card className='p-6'>
      <h4 className='font-medium mb-4 flex items-center'>
        <Icons name='IconSearch' size={16} className='mr-2' />
        {t('seo.preview.title')}
      </h4>

      {/* Google Search Preview */}
      <div className='space-y-4'>
        <div>
          <h5 className='text-sm font-medium text-gray-700 mb-2'>{t('seo.preview.google')}</h5>
          <div className='border border-gray-200 rounded-lg p-4 bg-white'>
            <div className='text-xs text-gray-500 mb-1'>
              https://example.com/{seoData.canonical_url || 'page'}
            </div>
            <div className='text-blue-600 text-lg font-medium mb-1 cursor-pointer hover:underline'>
              {truncate(seoData.meta_title || 'Page Title', 60)}
            </div>
            <div className='text-gray-600 text-sm'>
              {truncate(seoData.meta_description || 'Page description will appear here...', 160)}
            </div>
          </div>
        </div>

        {/* Facebook Preview */}
        {(seoData.og_title || seoData.og_description || seoData.og_image) && (
          <div>
            <h5 className='text-sm font-medium text-gray-700 mb-2'>{t('seo.preview.facebook')}</h5>
            <div className='border border-gray-200 rounded-lg overflow-hidden bg-white'>
              {seoData.og_image && (
                <div className='h-32 bg-gray-200 flex items-center justify-center'>
                  <img
                    src={seoData.og_image}
                    alt='OG Preview'
                    className='h-full w-full object-cover'
                    onError={e => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {!seoData.og_image && (
                    <Icons name='IconPhoto' size={32} className='text-gray-400' />
                  )}
                </div>
              )}
              <div className='p-3'>
                <div className='text-gray-500 text-xs uppercase mb-1'>EXAMPLE.COM</div>
                <div className='font-medium text-gray-900 mb-1'>
                  {truncate(seoData.og_title || seoData.meta_title || 'Page Title', 100)}
                </div>
                <div className='text-gray-600 text-sm'>
                  {truncate(
                    seoData.og_description || seoData.meta_description || 'Description',
                    300
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Twitter Preview */}
        {(seoData.twitter_title || seoData.twitter_description) && (
          <div>
            <h5 className='text-sm font-medium text-gray-700 mb-2'>{t('seo.preview.twitter')}</h5>
            <div className='border border-gray-200 rounded-lg overflow-hidden bg-white'>
              {seoData.twitter_image && (
                <div className='h-32 bg-gray-200 flex items-center justify-center'>
                  <img
                    src={seoData.twitter_image}
                    alt='Twitter Preview'
                    className='h-full w-full object-cover'
                  />
                </div>
              )}
              <div className='p-3'>
                <div className='font-medium text-gray-900 mb-1'>
                  {truncate(seoData.twitter_title || seoData.meta_title || 'Page Title', 70)}
                </div>
                <div className='text-gray-600 text-sm mb-2'>
                  {truncate(
                    seoData.twitter_description || seoData.meta_description || 'Description',
                    200
                  )}
                </div>
                <div className='text-gray-500 text-xs'>🔗 example.com</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
