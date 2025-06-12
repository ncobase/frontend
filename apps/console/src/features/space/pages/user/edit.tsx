// ./apps/console/src/features/space/pages/user/edit.tsx
import { useEffect } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { EditSpaceUserForm } from '../../forms/user/edit';
import { useQueryUserSpaceRoles, useUpdateUserSpaceRole, useQuerySpace } from '../../service';

import { Page, Topbar } from '@/components/layout';
import { useQueryUser } from '@/features/system/user/service';

export const SpaceUserEditPage = () => {
  const { spaceId, userId } = useParams<{ spaceId: string; userId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const { data: space } = useQuerySpace(spaceId!);
  const { data: userSpaceData, isLoading: spaceDataLoading } = useQueryUserSpaceRoles(
    spaceId!,
    userId!
  );
  const { data: userData, isLoading: userDataLoading } = useQueryUser(userId!);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm();

  const updateUserSpaceRoleMutation = useUpdateUserSpaceRole();

  const isLoading = spaceDataLoading || userDataLoading;

  // Reset form when data loads
  useEffect(() => {
    if (userSpaceData && userData) {
      const formData = {
        user_id: userData.id,
        username: userData.username,
        space_id: spaceId,
        role_ids: userSpaceData.role_ids || [],
        custom_title: userSpaceData.custom_title || '',
        department: userSpaceData.department || '',
        access_level: userSpaceData.access_level || 'standard',
        is_active: userSpaceData.is_active !== false,
        notes: userSpaceData.notes || ''
      };
      reset(formData);
    }
  }, [userSpaceData, userData, reset, spaceId]);

  const onSubmit = handleSubmit(async data => {
    try {
      await updateUserSpaceRoleMutation.mutateAsync({
        spaceId: spaceId!,
        userId: userId!,
        ...data
      });

      toast.success(t('messages.success'), {
        description: t('space.users.messages.update_success')
      });
      navigate(`/spaces/${spaceId}/users/view/${userId}`);
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.users.messages.update_failed')
      });
      console.error('Update user space settings error:', error);
    }
  });

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm(t('space.users.edit.unsaved_changes_warning'))) {
        navigate(`/spaces/${spaceId}/users/view/${userId}`);
      }
    } else {
      navigate(`/spaces/${spaceId}/users/view/${userId}`);
    }
  };

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

  if (!userSpaceData || !userData) {
    return (
      <Page>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <Icons name='IconExclamationTriangle' size={48} className='mx-auto mb-4 text-red-500' />
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              {t('space.users.edit.not_found_title')}
            </h2>
            <p className='text-gray-600 mb-4'>{t('space.users.edit.not_found_description')}</p>
            <Button onClick={() => navigate(`/spaces/${spaceId}/users`)}>
              {t('actions.back_to_list')}
            </Button>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title={t('space.users.edit_title')}
      topbar={
        <Topbar
          title={t('space.users.edit_title')}
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate(`/spaces/${spaceId}/users/view/${userId}`)}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
          ]}
          right={[
            <Button variant='outline' size='sm' onClick={handleCancel} disabled={isSubmitting}>
              {t('actions.cancel')}
            </Button>,
            <Button
              onClick={onSubmit}
              size='sm'
              loading={isSubmitting || updateUserSpaceRoleMutation.isPending}
              disabled={!isDirty}
              className='min-w-[100px]'
            >
              <Icons name='IconCheck' size={16} className='mr-2' />
              {t('actions.save')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8'
    >
      {/* Header Card */}
      <div className='bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100'>
        <div className='flex items-center gap-4'>
          <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
            <Icons name='IconUserEdit' size={32} className='text-white' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 mb-1'>{userData.username}</h1>
            <div className='flex items-center gap-4 text-sm text-gray-500'>
              <span className='flex items-center gap-1'>
                <Icons name='IconMail' size={14} />
                {userData.email}
              </span>
              {space && (
                <span className='flex items-center gap-1'>
                  <Icons name='IconBuilding' size={14} />
                  {space.name}
                </span>
              )}
              {isDirty && (
                <span className='flex items-center gap-1 text-amber-600 font-medium'>
                  <Icons name='IconEdit' size={14} />
                  {t('space.users.edit.unsaved_changes')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}

      <EditSpaceUserForm
        spaceId={spaceId!}
        userId={userId!}
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />

      {/* Save Reminder */}
      {isDirty && (
        <div className='fixed bottom-6 right-6 bg-white border border-amber-200 rounded-lg shadow-lg p-4 max-w-sm'>
          <div className='flex items-start gap-3'>
            <Icons name='IconAlertTriangle' size={20} className='text-amber-500 mt-0.5' />
            <div>
              <p className='font-medium text-gray-900 text-sm'>
                {t('space.users.edit.unsaved_reminder_title')}
              </p>
              <p className='text-xs text-gray-600 mt-1'>
                {t('space.users.edit.unsaved_reminder_description')}
              </p>
              <div className='flex gap-2 mt-3'>
                <Button size='xs' onClick={onSubmit} loading={isSubmitting}>
                  {t('actions.save')}
                </Button>
                <Button size='xs' variant='outline' onClick={handleCancel}>
                  {t('actions.discard')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};
