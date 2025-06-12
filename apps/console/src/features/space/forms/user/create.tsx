import { Form, FormSection, Section } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useListRoles } from '@/features/system/role/service';

export const CreateSpaceUserForm = ({ spaceId, onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { data: rolesData } = useListRoles({ limit: 100 });
  const roles = rolesData?.items || [];

  const formSections: FormSection[] = [
    {
      id: 'user_selection',
      title: t('space.users.section.user_selection', 'User Selection'),
      subtitle: t('space.users.section.user_selection_subtitle', 'Choose user and assign roles'),
      icon: 'IconUser',
      collapsible: false,
      fields: [
        {
          title: t('space.users.fields.user_search', 'Search User'),
          name: 'user_search',
          type: 'autocomplete',
          defaultValue: '',
          placeholder: t('space.users.placeholders.user_search', 'Search by username or email'),
          description: t('space.users.hints.user_search', 'Type to search for existing users'),
          asyncSearch: true,
          searchApi: '/sys/users/filter',
          displayKey: 'username',
          valueKey: 'id',
          className: 'col-span-full'
        },
        {
          title: t('space.users.fields.user_id', 'User ID'),
          name: 'user_id',
          type: 'text',
          defaultValue: '',
          placeholder: t('space.users.placeholders.user_id', 'Enter user ID directly'),
          description: t(
            'space.users.hints.user_id',
            'Alternative to search - enter user ID if known'
          ),
          rules: {
            required: t('forms.input_required')
          }
        },
        {
          title: t('space.users.fields.role_ids', 'Assign Roles'),
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
      id: 'additional_info',
      title: t('space.users.section.additional_info', 'Additional Information'),
      subtitle: t(
        'space.users.section.additional_info_subtitle',
        'Optional space-specific settings'
      ),
      icon: 'IconInfoCircle',
      collapsible: true,
      fields: [
        {
          title: t('space.users.fields.custom_title', 'Custom Title'),
          name: 'custom_title',
          type: 'text',
          defaultValue: '',
          placeholder: t('space.users.placeholders.custom_title', 'Space-specific title'),
          description: t('space.users.hints.custom_title', 'Override user title within this space')
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

  return (
    <div className='space-y-6'>
      {formSections.map(section => (
        <Section
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          icon={section.icon}
          collapsible={section.collapsible}
          className='mb-6 rounded-lg transition-shadow hover:shadow-md'
        >
          <Form
            id={`create-space-user-${section.id}`}
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
