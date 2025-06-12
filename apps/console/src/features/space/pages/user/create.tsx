import { Button, Icons } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { CreateSpaceUserForm } from '../../forms/user/create';
import { useAddUserToSpaceRole, useQuerySpace } from '../../service';

import { Page, Topbar } from '@/components/layout';

export const CreateSpaceUserPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastMessage();
  const { spaceId } = useParams<{ spaceId: string }>();

  const { data: space } = useQuerySpace(spaceId!);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      user_id: '',
      role_ids: [],
      custom_title: '',
      department: '',
      access_level: 'standard',
      notes: ''
    }
  });

  const addUserMutation = useAddUserToSpaceRole();

  const onSubmit = handleSubmit(async data => {
    try {
      // Handle multiple roles if provided
      const roleIds = Array.isArray(data.role_ids) ? data.role_ids : [data.role_ids];

      // Add user to space with first role, then add additional roles
      await addUserMutation.mutateAsync({
        spaceId: spaceId!,
        user_id: data.user_id,
        role_id: roleIds[0],
        ...data
      });

      // Add additional roles if any
      if (roleIds.length > 1) {
        for (const roleId of roleIds.slice(1)) {
          await addUserMutation.mutateAsync({
            spaceId: spaceId!,
            user_id: data.user_id,
            role_id: roleId
          });
        }
      }

      toast.success(t('messages.success'), {
        description: t('space.users.messages.add_success')
      });
      navigate(`/spaces/${spaceId}/users`);
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.users.messages.add_failed')
      });
      console.error('Add user to space error:', error);
    }
  });

  return (
    <Page
      title={t('space.users.create_title')}
      topbar={
        <Topbar
          title={t('space.users.create_title')}
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
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate(`/spaces/${spaceId}/users`)}
              disabled={isSubmitting}
            >
              {t('actions.cancel')}
            </Button>,
            <Button
              onClick={onSubmit}
              size='sm'
              loading={isSubmitting || addUserMutation.isPending}
              className='min-w-[100px]'
            >
              <Icons name='IconUserPlus' size={16} className='mr-2' />
              {t('actions.add_user')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8'
    >
      {/* Header Card */}
      <div className='bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-8 border border-purple-100'>
        <div className='flex items-center gap-4'>
          <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
            <Icons name='IconUserPlus' size={32} className='text-white' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 mb-1'>
              {t('space.users.create_welcome_title', 'Add New User')}
            </h1>
            <p className='text-gray-600'>
              {space
                ? t(
                    'space.users.create_welcome_description',
                    'Grant user access to "{{spaceName}}" with specific roles and permissions.',
                    { spaceName: space.name }
                  )
                : t(
                    'space.users.create_welcome_description_generic',
                    'Grant user access to this space with specific roles and permissions.'
                  )}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}

      <CreateSpaceUserForm
        spaceId={spaceId!}
        onSubmit={onSubmit}
        control={control}
        errors={errors}
      />

      {/* Tips Card */}
      <div className='max-w-4xl mx-auto mt-8'>
        <div className='bg-blue-50 border border-blue-200 rounded-xl p-6'>
          <div className='flex items-start gap-3'>
            <Icons name='IconInfoCircle' size={24} className='text-blue-600 mt-0.5' />
            <div>
              <h3 className='font-semibold text-blue-900 mb-2'>
                {t('space.users.create_tips_title', 'User Access Tips')}
              </h3>
              <ul className='text-sm text-blue-800 space-y-1'>
                <li>
                  •{' '}
                  {t(
                    'space.users.tip_1',
                    'Users must exist in the system before adding them to a space'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'space.users.tip_2',
                    'Multiple roles can be assigned to give users flexible permissions'
                  )}
                </li>
                <li>
                  • {t('space.users.tip_3', 'Access levels control what actions users can perform')}
                </li>
                <li>
                  •{' '}
                  {t(
                    'space.users.tip_4',
                    'Custom titles and departments help organize team members'
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};
