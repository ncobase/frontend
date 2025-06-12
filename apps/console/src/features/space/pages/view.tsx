import { useState } from 'react';

import { Card, Button, Icons, Badge, Tooltip, Modal } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { SpaceBillingManagement } from '../components/billing_management';
import { SpaceQuotaManagement } from '../components/quota_management';
import { SpaceSettings } from '../components/settings';
import { useQuerySpace } from '../service';

import { ErrorPage } from '@/components/errors';
import { Page, Topbar } from '@/components/layout';

export const SpaceViewPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: space, isLoading, error } = useQuerySpace(slug!);

  // Modal states
  const [settingsModal, setSettingsModal] = useState<{
    open: boolean;
    activeTab?: string;
  }>({ open: false, activeTab: 'general' });

  const [quotasModal, setQuotasModal] = useState(false);
  const [billingModal, setBillingModal] = useState(false);

  if (isLoading) {
    return (
      <Page>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <Icons name='IconLoader2' className='animate-spin mx-auto mb-4' size={40} />
            <p className='text-gray-600'>{t('common.loading')}</p>
          </div>
        </div>
      </Page>
    );
  }

  if (error || !space) {
    return (
      <Page>
        <ErrorPage code={404} />
      </Page>
    );
  }

  const getSpaceTypeBadge = (type: string) => {
    const typeConfig = {
      private: { variant: 'primary', label: t('common.types.private'), icon: 'IconLock' },
      public: { variant: 'success', label: t('common.types.public'), icon: 'IconWorld' },
      internal: { variant: 'warning', label: t('common.types.internal'), icon: 'IconBuilding' },
      external: { variant: 'info', label: t('common.types.external'), icon: 'IconExternalLink' },
      other: { variant: 'secondary', label: t('common.types.other'), icon: 'IconDots' }
    };
    const config = typeConfig[type] || typeConfig.other;
    return (
      <Badge variant={config.variant} className='flex items-center gap-1 px-3 py-1'>
        <Icons name={config.icon} size={14} />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (disabled: boolean, expired?: boolean) => {
    if (expired) {
      return (
        <Badge variant='danger' className='flex items-center gap-1 px-3 py-1'>
          <Icons name='IconCalendarX' size={14} />
          {t('space.status.expired')}
        </Badge>
      );
    }
    return (
      <Badge
        variant={disabled ? 'warning' : 'success'}
        className='flex items-center gap-1 px-3 py-1'
      >
        <Icons name={disabled ? 'IconCirclePause' : 'IconCircleCheck'} size={14} />
        {disabled ? t('space.status.disabled') : t('space.status.active')}
      </Badge>
    );
  };

  const isExpired = space.expired_at && new Date(space.expired_at) < new Date();

  return (
    <Page
      title={space.name}
      topbar={
        <Topbar
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/spaces')}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
          ]}
          right={[
            <Button
              variant='outline'
              size='sm'
              onClick={() => setSettingsModal({ open: true, activeTab: 'general' })}
            >
              <Icons name='IconSettings' size={16} className='mr-2' />
              {t('actions.settings')}
            </Button>,
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate(`/spaces/${space.id}/edit`)}
            >
              <Icons name='IconEdit' size={16} className='mr-2' />
              {t('actions.edit')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-8'
    >
      {/* Header */}
      <div className='bg-white rounded-xl p-8 shadow-sm border border-gray-100'>
        <div className='flex items-start justify-between flex-wrap gap-6'>
          <div className='flex items-start gap-6'>
            <div className='flex items-center gap-4'>
              {space.logo ? (
                <img
                  src={space.logo}
                  alt={space.logo_alt || space.name}
                  className='w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg'
                />
              ) : (
                <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg'>
                  <Icons name='IconBuilding' size={40} className='text-white' />
                </div>
              )}
              <div>
                <div className='flex items-center gap-3 mb-2'>
                  <h1 className='text-3xl font-bold text-gray-900'>{space.name}</h1>
                  {getStatusBadge(space.disabled, isExpired)}
                  {getSpaceTypeBadge(space.type)}
                </div>
                <div className='flex items-center gap-4 text-sm text-gray-500'>
                  <span className='flex items-center gap-1'>
                    <Icons name='IconHash' size={14} />
                    {space.slug}
                  </span>
                  {space.url && (
                    <a
                      href={space.url.startsWith('http') ? space.url : `https://${space.url}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1 text-blue-500 hover:text-blue-600'
                    >
                      <Icons name='IconExternalLink' size={14} />
                      {space.url}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {space.description && (
          <div className='mt-6 pt-6 border-t border-gray-100'>
            <p className='text-gray-700 leading-relaxed'>{space.description}</p>
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Quick Actions */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <Icons name='IconZap' size={20} />
                {t('space.section.quick_actions')}
              </h3>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <Button
                  variant='outline'
                  className='h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow'
                  onClick={() => navigate(`/spaces/${space.id}/users`)}
                >
                  <Icons name='IconUsers' size={24} className='text-blue-500' />
                  <span className='text-sm font-medium'>{t('space.actions.users')}</span>
                </Button>

                <Button
                  variant='outline'
                  className='h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow'
                  onClick={() => setQuotasModal(true)}
                >
                  <Icons name='IconGauge' size={24} className='text-green-500' />
                  <span className='text-sm font-medium'>{t('space.actions.quotas')}</span>
                </Button>

                <Button
                  variant='outline'
                  className='h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow'
                  onClick={() => setBillingModal(true)}
                >
                  <Icons name='IconCreditCard' size={24} className='text-purple-500' />
                  <span className='text-sm font-medium'>{t('space.actions.billing')}</span>
                </Button>

                <Button
                  variant='outline'
                  className='h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow'
                  onClick={() => setSettingsModal({ open: true, activeTab: 'general' })}
                >
                  <Icons name='IconSettings' size={24} className='text-orange-500' />
                  <span className='text-sm font-medium'>{t('space.actions.settings')}</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* SEO Information */}
          {(space.title || space.keywords || space.copyright) && (
            <Card className='overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h3 className='text-lg font-semibold flex items-center gap-2'>
                  <Icons name='IconSearch' size={20} />
                  {t('space.section.seo')}
                </h3>
              </div>
              <div className='p-6 space-y-4'>
                {space.title && (
                  <div>
                    <label className='text-sm font-medium text-gray-500 block mb-1'>
                      {t('space.fields.title')}
                    </label>
                    <p className='text-gray-900'>{space.title}</p>
                  </div>
                )}

                {space.keywords && (
                  <div>
                    <label className='text-sm font-medium text-gray-500 block mb-2'>
                      {t('space.fields.keywords')}
                    </label>
                    <div className='flex flex-wrap gap-2'>
                      {space.keywords.split(',').map((keyword, index) => (
                        <Badge key={index} variant='outline' className='text-xs'>
                          {keyword.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {space.copyright && (
                  <div>
                    <label className='text-sm font-medium text-gray-500 block mb-1'>
                      {t('space.fields.copyright')}
                    </label>
                    <p className='text-gray-700 text-sm'>{space.copyright}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className='space-y-8'>
          {/* Space Information */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <Icons name='IconInfoCircle' size={20} />
                {t('space.section.information')}
              </h3>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-500 block mb-1'>
                  {t('space.fields.id')}
                </label>
                <p className='text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded'>
                  {space.id}
                </p>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-500 block mb-1'>
                  {t('space.fields.order')}
                </label>
                <p className='text-sm text-gray-900'>{space.order || 0}</p>
              </div>

              {space.expired_at && (
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-1'>
                    {t('space.fields.expired_at')}
                  </label>
                  <p className='text-sm text-gray-900'>
                    {formatDateTime(space.expired_at, 'date')}
                  </p>
                </div>
              )}

              <div>
                <label className='text-sm font-medium text-gray-500 block mb-1'>
                  {t('space.fields.created_at')}
                </label>
                <Tooltip content={formatDateTime(space.created_at, 'dateTime')}>
                  <p className='text-sm text-gray-900'>
                    {formatDateTime(space.created_at, 'date')}
                  </p>
                </Tooltip>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-500 block mb-1'>
                  {t('space.fields.updated_at')}
                </label>
                <Tooltip content={formatDateTime(space.updated_at, 'dateTime')}>
                  <p className='text-sm text-gray-900'>
                    {formatDateTime(space.updated_at, 'date')}
                  </p>
                </Tooltip>
              </div>
            </div>
          </Card>

          {/* Status Card */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <Icons name='IconActivity' size={20} />
                {t('space.section.status')}
              </h3>
            </div>
            <div className='p-6'>
              <div
                className={`text-center p-4 rounded-lg ${
                  space.disabled
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-green-50 border border-green-200'
                }`}
              >
                <Icons
                  name={space.disabled ? 'IconCirclePause' : 'IconCircleCheck'}
                  size={32}
                  className={`mx-auto mb-2 ${space.disabled ? 'text-red-500' : 'text-green-500'}`}
                />
                <p
                  className={`font-semibold ${space.disabled ? 'text-red-800' : 'text-green-800'}`}
                >
                  {space.disabled ? t('space.status.disabled') : t('space.status.active')}
                </p>
                <p className={`text-sm mt-1 ${space.disabled ? 'text-red-600' : 'text-green-600'}`}>
                  {space.disabled
                    ? t('space.status.disabled_description')
                    : t('space.status.active_description')}
                </p>
              </div>
            </div>
          </Card>

          {/* Branding */}
          {space.logo_alt && (
            <Card className='overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h3 className='text-lg font-semibold flex items-center gap-2'>
                  <Icons name='IconPalette' size={20} />
                  {t('space.section.branding')}
                </h3>
              </div>
              <div className='p-6'>
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-1'>
                    {t('space.fields.logo_alt')}
                  </label>
                  <p className='text-sm text-gray-900'>{space.logo_alt}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <SpaceSettings
        isOpen={settingsModal.open}
        onClose={() => setSettingsModal({ open: false, activeTab: 'general' })}
        space={space}
        initialTab={settingsModal.activeTab}
        onSuccess={() => {
          setSettingsModal({ open: false, activeTab: 'general' });
          window.location.reload(); // Refresh to show updated data
        }}
        onNavigateToQuotas={() => {
          setSettingsModal({ open: false, activeTab: 'general' });
          setQuotasModal(true);
        }}
        onNavigateToBilling={() => {
          setSettingsModal({ open: false, activeTab: 'general' });
          setBillingModal(true);
        }}
        onNavigateToView={() => {}}
        onNavigateToEdit={() => navigate(`/spaces/${space.id}/edit`)}
      />

      <Modal
        isOpen={quotasModal}
        onCancel={() => setQuotasModal(false)}
        title={t('space.quotas.manage_title')}
        className='max-w-6xl'
      >
        <SpaceQuotaManagement
          space={space}
          onNavigateToSettings={() => {
            setQuotasModal(false);
            setSettingsModal({ open: true, activeTab: 'quotas' });
          }}
        />
      </Modal>

      <Modal
        isOpen={billingModal}
        onCancel={() => setBillingModal(false)}
        title={t('space.billing.manage_title')}
        className='max-w-6xl'
      >
        <SpaceBillingManagement
          space={space}
          onNavigateToSettings={() => {
            setBillingModal(false);
            setSettingsModal({ open: true, activeTab: 'billing' });
          }}
        />
      </Modal>
    </Page>
  );
};
