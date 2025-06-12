import { useEffect } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { CreateSpaceForm } from '../forms/create';
import { useCreateSpace } from '../service';
import { Space } from '../space.d';

import { Page, Topbar } from '@/components/layout';

export const CreateSpacePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      slug: '',
      type: 'private',
      url: '',
      title: '',
      description: '',
      keywords: '',
      copyright: '',
      logo: null,
      logo_alt: '',
      order: 0,
      expired_at: '',
      disabled: false
    }
  });

  const createSpaceMutation = useCreateSpace();

  // Auto-generate slug from name
  const watchedName = watch('name');
  useEffect(() => {
    if (watchedName && !watch('slug')) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  }, [watchedName, setValue, watch]);

  const onSubmit = handleSubmit(async data => {
    try {
      // Transform data
      const transformedData = {
        ...data,
        slug: data.slug?.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        expired_at: data.expired_at ? new Date(data.expired_at).getTime() : null,
        order: Number(data.order) || 0,
        disabled: Boolean(data.disabled)
      };

      await createSpaceMutation.mutateAsync(transformedData as Space);
      toast.success(t('messages.success'), {
        description: t('space.messages.create_success')
      });
      navigate('/spaces');
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.messages.create_failed')
      });
      console.error('Create space error:', error);
    }
  });

  return (
    <Page
      title={t('space.create.title')}
      topbar={
        <Topbar
          title={t('space.create.title')}
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
              onClick={() => navigate('/spaces')}
              disabled={isSubmitting}
            >
              {t('actions.cancel')}
            </Button>,
            <Button
              onClick={onSubmit}
              size='sm'
              loading={isSubmitting || createSpaceMutation.isPending}
              className='min-w-[100px]'
            >
              <Icons name='IconCheck' size={16} className='mr-2' />
              {t('actions.create')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8'
    >
      <CreateSpaceForm onSubmit={onSubmit} control={control} setValue={setValue} errors={errors} />
      {/* Tips Card */}
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='bg-amber-50 border border-amber-200 rounded-xl p-6'>
          <div className='flex items-start gap-3'>
            <Icons name='IconLightbulb' size={24} className='text-amber-600 mt-0.5' />
            <div>
              <h3 className='font-semibold text-amber-900 mb-2'>
                {t('space.create.tips_title', 'Pro Tips')}
              </h3>
              <ul className='text-sm text-amber-800 space-y-1'>
                <li>
                  •{' '}
                  {t(
                    'space.create.tip_1',
                    'Choose a descriptive name that reflects your space purpose'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'space.create.tip_2',
                    'The slug will be used in URLs, so keep it short and memorable'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'space.create.tip_3',
                    'You can always update settings, users, and permissions after creation'
                  )}
                </li>
                <li>
                  •{' '}
                  {t('space.create.tip_4', 'Private spaces are only accessible to assigned users')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};
