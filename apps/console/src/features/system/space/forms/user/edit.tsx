import { useEffect } from 'react';

import { Form, FormSection, Section } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useListRoles } from '../../../role/service';
import { useQueryUserSpaceRoles } from '../../service';

export const EditSpaceUserForm = ({ spaceId, userId, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data: userSpaceRoles, isLoading } = useQueryUserSpaceRoles(spaceId, userId);
  const { data: rolesData } = useListRoles({ limit: 100 });
  const roles = rolesData?.items || [];

  const formSections: FormSection[] = [
    {
      id: 'user_info',
      title: t('space.users.section.user_info', 'User Information'),
      subtitle: t('space.users.section.user_info_subtitle', 'Current user and role assignments'),
      icon: 'IconUser',
      collapsible: false,
      fields: [
        {
          title: t('space.users.fields.user_id', 'User ID'),
          name: 'user_id',
          type: 'text',
          defaultValue: '',
          disabled: true,
          description: t('space.users.hints.user_id_readonly', 'User ID cannot be changed')
        },
        {
          title: t('space.users.fields.username', 'Username'),
          name: 'username',
          type: 'text',
          defaultValue: '',
          disabled: true,
          description: t('space.users.hints.username_readonly', 'Display only')
        },
        {
          title: t('space.users.fields.role_ids', 'Assigned Roles'),
          name: 'role_ids',
          type: 'multi-select',
          defaultValue: [],
          placeholder: t('space.users.placeholders.role_ids', 'Select roles to assign'),
          options: roles.map(role => ({
            label: role.name,
            value: role.id,
            description: role.description
          })),
          rules: {
            required: t('forms.select_required')
          },
          className: 'col-span-full'
        }
      ]
    },
    {
      id: 'space_specific',
      title: t('space.users.section.space_specific', 'Space-Specific Settings'),
      subtitle: t(
        'space.users.section.space_specific_subtitle',
        'Customize user settings for this space'
      ),
      icon: 'IconSettings',
      collapsible: true,
      fields: [
        {
          title: t('space.users.fields.custom_title', 'Custom Title'),
          name: 'custom_title',
          type: 'text',
          defaultValue: '',
          placeholder: t('space.users.placeholders.custom_title', 'Space-specific title')
        },
        {
          title: t('space.users.fields.department', 'Department'),
          name: 'department',
          type: 'select',
          defaultValue: '',
          placeholder: t('space.users.placeholders.department', 'Select department'),
          options: [
            { label: t('departments.engineering'), value: 'engineering' },
            { label: t('departments.sales'), value: 'sales' },
            { label: t('departments.marketing'), value: 'marketing' },
            { label: t('departments.hr'), value: 'hr' },
            { label: t('departments.finance'), value: 'finance' },
            { label: t('departments.operations'), value: 'operations' }
          ]
        },
        {
          title: t('space.users.fields.access_level', 'Access Level'),
          name: 'access_level',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: t('space.users.access_levels.limited'), value: 'limited' },
            { label: t('space.users.access_levels.standard'), value: 'standard' },
            { label: t('space.users.access_levels.elevated'), value: 'elevated' },
            { label: t('space.users.access_levels.admin'), value: 'admin' }
          ]
        },
        {
          title: t('space.users.fields.is_active', 'Active in Space'),
          name: 'is_active',
          type: 'switch',
          defaultValue: true,
          description: t('space.users.hints.is_active', 'Enable/disable user access to this space')
        },
        {
          title: t('space.users.fields.notes', 'Notes'),
          name: 'notes',
          type: 'textarea',
          defaultValue: '',
          placeholder: t(
            'space.users.placeholders.notes',
            'Internal notes about this user assignment'
          ),
          className: 'col-span-full',
          rows: 3
        }
      ]
    }
  ];

  // Set form values when data is loaded
  useEffect(() => {
    if (!userSpaceRoles || isLoading) return;

    setValue('user_id', userId);
    setValue('space_id', spaceId);

    // Set role IDs from user space roles
    if (userSpaceRoles.role_ids) {
      setValue('role_ids', userSpaceRoles.role_ids);
    }

    // Set additional user info if available
    if (userSpaceRoles.username) {
      setValue('username', userSpaceRoles.username);
    }
    if (userSpaceRoles.custom_title) {
      setValue('custom_title', userSpaceRoles.custom_title);
    }
    if (userSpaceRoles.department) {
      setValue('department', userSpaceRoles.department);
    }
    if (userSpaceRoles.access_level) {
      setValue('access_level', userSpaceRoles.access_level);
    }
    if (userSpaceRoles.is_active !== undefined) {
      setValue('is_active', userSpaceRoles.is_active);
    }
    if (userSpaceRoles.notes) {
      setValue('notes', userSpaceRoles.notes);
    }
  }, [setValue, userSpaceRoles, isLoading, userId, spaceId]);

  if (isLoading) {
    return <div className='p-4 text-center'>Loading user space data...</div>;
  }

  return (
    <div className='space-y-6'>
      {formSections.map(section => (
        <Section
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          icon={section.icon}
          collapsible={section.collapsible}
          className='mb-6'
        >
          <Form
            id={`edit-space-user-${section.id}`}
            className='md:grid-cols-2'
            onSubmit={onSubmit}
            control={control}
            errors={errors}
            fields={section.fields}
          />
        </Section>
      ))}
    </div>
  );
};
