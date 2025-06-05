import { Form, FormSection, Section } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useListRoles } from '../../../role/service';

export const CreateTenantUserForm = ({ tenantId, onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { data: rolesData } = useListRoles({ limit: 100 });
  const roles = rolesData?.items || [];

  const formSections: FormSection[] = [
    {
      id: 'user_selection',
      title: t('tenant.users.section.user_selection', 'User Selection'),
      subtitle: t('tenant.users.section.user_selection_subtitle', 'Choose user and assign roles'),
      icon: 'IconUser',
      collapsible: false,
      fields: [
        {
          title: t('tenant.users.fields.user_search', 'Search User'),
          name: 'user_search',
          type: 'autocomplete',
          defaultValue: '',
          placeholder: t('tenant.users.placeholders.user_search', 'Search by username or email'),
          description: t('tenant.users.hints.user_search', 'Type to search for existing users'),
          asyncSearch: true,
          searchApi: '/sys/users/filter',
          displayKey: 'username',
          valueKey: 'id',
          className: 'col-span-full'
        },
        {
          title: t('tenant.users.fields.user_id', 'User ID'),
          name: 'user_id',
          type: 'text',
          defaultValue: '',
          placeholder: t('tenant.users.placeholders.user_id', 'Enter user ID directly'),
          description: t(
            'tenant.users.hints.user_id',
            'Alternative to search - enter user ID if known'
          ),
          rules: {
            required: t('forms.input_required')
          }
        },
        {
          title: t('tenant.users.fields.role_ids', 'Assign Roles'),
          name: 'role_ids',
          type: 'multi-select',
          defaultValue: [],
          placeholder: t('tenant.users.placeholders.role_ids', 'Select roles to assign'),
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
      title: t('tenant.users.section.additional_info', 'Additional Information'),
      subtitle: t(
        'tenant.users.section.additional_info_subtitle',
        'Optional tenant-specific settings'
      ),
      icon: 'IconInfoCircle',
      collapsible: true,
      fields: [
        {
          title: t('tenant.users.fields.custom_title', 'Custom Title'),
          name: 'custom_title',
          type: 'text',
          defaultValue: '',
          placeholder: t('tenant.users.placeholders.custom_title', 'Tenant-specific title'),
          description: t(
            'tenant.users.hints.custom_title',
            'Override user title within this tenant'
          )
        },
        {
          title: t('tenant.users.fields.department', 'Department'),
          name: 'department',
          type: 'select',
          defaultValue: '',
          placeholder: t('tenant.users.placeholders.department', 'Select department'),
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
          title: t('tenant.users.fields.access_level', 'Access Level'),
          name: 'access_level',
          type: 'select',
          defaultValue: 'standard',
          options: [
            { label: t('tenant.users.access_levels.limited'), value: 'limited' },
            { label: t('tenant.users.access_levels.standard'), value: 'standard' },
            { label: t('tenant.users.access_levels.elevated'), value: 'elevated' },
            { label: t('tenant.users.access_levels.admin'), value: 'admin' }
          ]
        },
        {
          title: t('tenant.users.fields.notes', 'Notes'),
          name: 'notes',
          type: 'textarea',
          defaultValue: '',
          placeholder: t(
            'tenant.users.placeholders.notes',
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
          className='mb-6'
        >
          <Form
            id={`create-tenant-user-${section.id}`}
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
