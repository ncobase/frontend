import { useState } from 'react';

import { Card, Button, Icons, Badge, Tooltip } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { SpaceUserRoleManagement } from '../../components/user_role_management';
import { useQueryUserSpaceRoles, useQuerySpace } from '../../service';

import { ErrorPage } from '@/components/errors';
import { Page, Topbar } from '@/components/layout';
import { useQueryUser } from '@/features/system/user/service';

export const SpaceUserViewPage = () => {
  const { spaceId, userId } = useParams<{ spaceId: string; userId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  console.log(spaceId, userId);

  const [roleManagementModal, setRoleManagementModal] = useState(false);

  const { data: _space } = useQuerySpace(spaceId!);
  const { data: userSpaceData, isLoading: spaceDataLoading } = useQueryUserSpaceRoles(
    spaceId!,
    userId!
  );
  const { data: userData, isLoading: userDataLoading } = useQueryUser(userId!);

  const isLoading = spaceDataLoading || userDataLoading;

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

  console.log(userSpaceData, userData);

  if (!userSpaceData || !userData) {
    return (
      <Page>
        <ErrorPage code={404} />
      </Page>
    );
  }

  const getAccessLevelBadge = (level: string) => {
    const levelConfig = {
      limited: {
        variant: 'warning',
        label: t('space.users.access_levels.limited'),
        icon: 'IconShieldX'
      },
      standard: {
        variant: 'primary',
        label: t('space.users.access_levels.standard'),
        icon: 'IconShield'
      },
      elevated: {
        variant: 'info',
        label: t('space.users.access_levels.elevated'),
        icon: 'IconShieldCheck'
      },
      admin: {
        variant: 'danger',
        label: t('space.users.access_levels.admin'),
        icon: 'IconShieldStar'
      }
    };
    const config = levelConfig[level] || levelConfig.standard;
    return (
      <Badge variant={config.variant} className='flex items-center gap-1 px-3 py-1'>
        <Icons name={config.icon} size={14} />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge
        variant={isActive ? 'success' : 'secondary'}
        className='flex items-center gap-1 px-3 py-1'
      >
        <Icons name={isActive ? 'IconUserCheck' : 'IconUserX'} size={14} />
        {isActive ? t('space.users.status.active') : t('space.users.status.inactive')}
      </Badge>
    );
  };

  const getUserStatusBadge = (status: number) => {
    const statusConfig = {
      0: { variant: 'success', label: t('user.status.active'), icon: 'IconCircleCheck' },
      1: { variant: 'warning', label: t('user.status.inactive'), icon: 'IconCirclePause' },
      2: { variant: 'danger', label: t('user.status.disabled'), icon: 'IconCircleX' }
    };
    const config = statusConfig[status] || statusConfig[0];
    return (
      <Badge variant={config.variant} className='flex items-center gap-1 px-3 py-1'>
        <Icons name={config.icon} size={14} />
        {config.label}
      </Badge>
    );
  };

  return (
    <Page
      title={userData.username}
      topbar={
        <Topbar
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate(`/spaces/${spaceId}/users`)}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
          ]}
          right={[
            <Button variant='outline' size='sm' onClick={() => setRoleManagementModal(true)}>
              <Icons name='IconUserCheck' size={16} className='mr-2' />
              {t('space.users.manage_roles')}
            </Button>,
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate(`/spaces/${spaceId}/users/edit/${userId}`)}
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
              <div className='w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
                <Icons name='IconUser' size={40} className='text-white' />
              </div>
              <div>
                <div className='flex items-center gap-3 mb-2'>
                  <h1 className='text-3xl font-bold text-gray-900'>{userData.username}</h1>
                  {getStatusBadge(userSpaceData.is_active !== false)}
                  {getUserStatusBadge(userData.status || 0)}
                  {userData.is_certified && (
                    <Badge variant='success' className='flex items-center gap-1 px-2 py-1'>
                      <Icons name='IconCertificate' size={12} />
                      {t('user.status.certified')}
                    </Badge>
                  )}
                </div>
                <div className='flex items-center gap-4 text-sm text-gray-500'>
                  <span className='flex items-center gap-1'>
                    <Icons name='IconMail' size={14} />
                    {userData.email}
                  </span>
                  {userData.phone && (
                    <span className='flex items-center gap-1'>
                      <Icons name='IconPhone' size={14} />
                      {userData.phone}
                    </span>
                  )}
                </div>
                {userSpaceData.custom_title && (
                  <div className='mt-2'>
                    <Badge variant='outline' className='text-xs'>
                      {userSpaceData.custom_title}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Space Roles */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <Icons name='IconUserCheck' size={20} />
                {t('space.users.section.space_roles')}
              </h3>
            </div>
            <div className='p-6'>
              {userSpaceData.role_ids && userSpaceData.role_ids.length > 0 ? (
                <div className='space-y-4'>
                  <div className='flex flex-wrap gap-2'>
                    {userSpaceData.role_ids.map((roleId: string) => (
                      <Badge key={roleId} variant='primary' className='px-3 py-2 text-sm'>
                        {roleId}
                      </Badge>
                    ))}
                  </div>
                  <div className='text-sm text-gray-600'>
                    {t('space.users.roles_assigned_count', {
                      count: userSpaceData.role_ids.length
                    })}
                  </div>
                </div>
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <Icons name='IconUserX' size={32} className='mx-auto mb-2' />
                  <p>{t('space.users.no_roles_assigned')}</p>
                  <Button size='sm' className='mt-3' onClick={() => setRoleManagementModal(true)}>
                    {t('space.users.assign_roles')}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Space-Specific Settings */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <Icons name='IconSettings' size={20} />
                {t('space.users.section.space_specific')}
              </h3>
            </div>
            <div className='p-6 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-1'>
                    {t('space.users.fields.access_level')}
                  </label>
                  {getAccessLevelBadge(userSpaceData.access_level || 'standard')}
                </div>

                {userSpaceData.department && (
                  <div>
                    <label className='text-sm font-medium text-gray-500 block mb-1'>
                      {t('space.users.fields.department')}
                    </label>
                    <p className='text-gray-900'>{t(`departments.${userSpaceData.department}`)}</p>
                  </div>
                )}
              </div>

              {userSpaceData.notes && (
                <div className='pt-4 border-t border-gray-100'>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>
                    {t('space.users.fields.notes')}
                  </label>
                  <p className='text-gray-700 bg-gray-50 p-3 rounded-lg text-sm'>
                    {userSpaceData.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-8'>
          {/* User Information */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <Icons name='IconInfoCircle' size={20} />
                {t('space.users.section.user_info')}
              </h3>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-500 block mb-1'>
                  {t('space.users.fields.user_id')}
                </label>
                <p className='text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded'>
                  {userData.id}
                </p>
              </div>

              <div>
                <label className='text-sm font-medium text-gray-500 block mb-1'>
                  {t('space.users.fields.user_created_at')}
                </label>
                <Tooltip content={formatDateTime(userData.created_at, 'dateTime')}>
                  <p className='text-sm text-gray-900'>
                    {formatDateTime(userData.created_at, 'date')}
                  </p>
                </Tooltip>
              </div>

              {userData.extras?.last_login && (
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-1'>
                    {t('space.users.fields.last_login')}
                  </label>
                  <Tooltip content={formatDateTime(userData.extras?.last_login, 'dateTime')}>
                    <p className='text-sm text-gray-900'>
                      {formatDateTime(userData.extras?.last_login, 'date')}
                    </p>
                  </Tooltip>
                </div>
              )}
            </div>
          </Card>

          {/* Space Relationship */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <Icons name='IconBuilding' size={20} />
                {t('space.users.section.space_relationship')}
              </h3>
            </div>
            <div className='p-6 space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-500 block mb-1'>
                  {t('space.users.fields.space_id')}
                </label>
                <p className='text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded'>
                  {userSpaceData.space_id}
                </p>
              </div>

              {userSpaceData.joined_at && (
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-1'>
                    {t('space.users.fields.joined_at')}
                  </label>
                  <Tooltip content={formatDateTime(userSpaceData.joined_at, 'dateTime')}>
                    <p className='text-sm text-gray-900'>
                      {formatDateTime(userSpaceData.joined_at, 'date')}
                    </p>
                  </Tooltip>
                </div>
              )}

              {userSpaceData.relationship_id && (
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-1'>
                    {t('space.users.fields.relationship_id')}
                  </label>
                  <p className='text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded'>
                    {userSpaceData.relationship_id}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold flex items-center gap-2'>
                <Icons name='IconZap' size={20} />
                {t('space.users.section.quick_actions')}
              </h3>
            </div>
            <div className='p-6 space-y-3'>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => setRoleManagementModal(true)}
              >
                <Icons name='IconUserCheck' size={16} className='mr-2' />
                {t('space.users.actions.manage_roles')}
              </Button>

              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => navigate(`/spaces/${spaceId}/users/edit/${userId}`)}
              >
                <Icons name='IconEdit' size={16} className='mr-2' />
                {t('space.users.actions.edit_settings')}
              </Button>

              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => navigate(`/users/${userId}`)}
              >
                <Icons name='IconExternalLink' size={16} className='mr-2' />
                {t('space.users.actions.view_user_profile')}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Role Management Modal */}
      <SpaceUserRoleManagement
        isOpen={roleManagementModal}
        onClose={() => setRoleManagementModal(false)}
        spaceId={spaceId!}
        user={{ ...userData, ...userSpaceData }}
        onSuccess={() => {
          setRoleManagementModal(false);
          window.location.reload(); // Refresh to show updated data
        }}
      />
    </Page>
  );
};
