import { useEffect } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { EditSpaceForm } from '../forms/editor';
import { useQuerySpace, useUpdateSpace } from '../service';

import { Page, Topbar } from '@/components/layout';

export const SpaceEditPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const { data: space, isLoading } = useQuerySpace(slug!);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm();
  const updateSpaceMutation = useUpdateSpace();

  // Reset form when space data loads
  useEffect(() => {
    if (space) {
      reset({
        ...space,
        expired_at: space.expired_at ? new Date(space.expired_at).toISOString().slice(0, 16) : ''
      });
    }
  }, [space, reset]);

  const onSubmit = handleSubmit(async data => {
    try {
      // Transform data
      const transformedData = {
        ...data,
        expired_at: data.expired_at ? new Date(data.expired_at).getTime() : null,
        order: Number(data.order) || 0,
        disabled: Boolean(data.disabled)
      };

      await updateSpaceMutation.mutateAsync(transformedData);
      toast.success(t('messages.success'), {
        description: t('space.messages.update_success')
      });
      navigate(`/spaces/${space.id}`);
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.messages.update_failed')
      });
      console.error('Update space error:', error);
    }
  });

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm(t('space.edit.unsaved_changes_warning'))) {
        navigate(`/spaces/${space.id}`);
      }
    } else {
      navigate(`/spaces/${space.id}`);
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

  if (!space) {
    return (
      <Page>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <Icons name='IconExclamationTriangle' size={48} className='mx-auto mb-4 text-red-500' />
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              {t('space.edit.not_found_title')}
            </h2>
            <p className='text-gray-600 mb-4'>{t('space.edit.not_found_description')}</p>
            <Button onClick={() => navigate('/spaces')}>{t('actions.back_to_list')}</Button>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      title={t('space.edit.title')}
      topbar={
        <Topbar
          title={t('space.edit.title')}
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate(`/spaces/${space.id}`)}
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
              loading={isSubmitting || updateSpaceMutation.isPending}
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
          {space.logo ? (
            <img
              src={space.logo}
              alt={space.logo_alt || space.name}
              className='w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-lg'
            />
          ) : (
            <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg'>
              <Icons name='IconBuilding' size={32} className='text-white' />
            </div>
          )}
          <div>
            <h1 className='text-2xl font-bold text-gray-900 mb-1'>{space.name}</h1>
            <div className='flex items-center gap-4 text-sm text-gray-500'>
              <span className='flex items-center gap-1'>
                <Icons name='IconHash' size={14} />
                {space.slug}
              </span>
              {isDirty && (
                <span className='flex items-center gap-1 text-amber-600 font-medium'>
                  <Icons name='IconEdit' size={14} />
                  {t('space.edit.unsaved_changes')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form */}

      <EditSpaceForm
        record={slug}
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
                {t('space.edit.unsaved_reminder_title')}
              </p>
              <p className='text-xs text-gray-600 mt-1'>
                {t('space.edit.unsaved_reminder_description')}
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
