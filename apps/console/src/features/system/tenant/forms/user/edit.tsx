import { useEffect } from 'react';

import { Form, FormSection, Section } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useListRoles } from '../../../role/service';
import { useQueryUserTenantRoles } from '../../service';

export const EditTenantUserForm = ({ tenantId, userId, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data: userTenantRoles, isLoading } = useQueryUserTenantRoles(tenantId, userId);
  const { data: rolesData } = useListRoles({ limit: 100 });
  const roles = rolesData?.items || [];

  const formSections: FormSection[] = [
    {
      id: 'user_info',
      title: t('tenant.users.section.user_info', 'User Information'),
      subtitle: t('tenant.users.section.user_info_subtitle', 'Current user and role assignments'),
      icon: 'IconUser',
      collapsible: false,
      fields: [
        {
          title: t('tenant.users.fields.user_id', 'User ID'),
          name: 'user_id',
          type: 'text',
          defaultValue: '',
          disabled: true,
          description: t('tenant.users.hints.user_id_readonly', 'User ID cannot be changed')
        },
        {
          title: t('tenant.users.fields.username', 'Username'),
          name: 'username',
          type: 'text',
          defaultValue: '',
          disabled: true,
          description: t('tenant.users.hints.username_readonly', 'Display only')
        },
        {
          title: t('tenant.users.fields.role_ids', 'Assigned Roles'),
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
      id: 'tenant_specific',
      title: t('tenant.users.section.tenant_specific', 'Tenant-Specific Settings'),
      subtitle: t(
        'tenant.users.section.tenant_specific_subtitle',
        'Customize user settings for this tenant'
      ),
      icon: 'IconSettings',
      collapsible: true,
      fields: [
        {
          title: t('tenant.users.fields.custom_title', 'Custom Title'),
          name: 'custom_title',
          type: 'text',
          defaultValue: '',
          placeholder: t('tenant.users.placeholders.custom_title', 'Tenant-specific title')
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
          title: t('tenant.users.fields.is_active', 'Active in Tenant'),
          name: 'is_active',
          type: 'switch',
          defaultValue: true,
          description: t(
            'tenant.users.hints.is_active',
            'Enable/disable user access to this tenant'
          )
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

  // Set form values when data is loaded
  useEffect(() => {
    if (!userTenantRoles || isLoading) return;

    setValue('user_id', userId);
    setValue('tenant_id', tenantId);

    // Set role IDs from user tenant roles
    if (userTenantRoles.role_ids) {
      setValue('role_ids', userTenantRoles.role_ids);
    }

    // Set additional user info if available
    if (userTenantRoles.username) {
      setValue('username', userTenantRoles.username);
    }
    if (userTenantRoles.custom_title) {
      setValue('custom_title', userTenantRoles.custom_title);
    }
    if (userTenantRoles.department) {
      setValue('department', userTenantRoles.department);
    }
    if (userTenantRoles.access_level) {
      setValue('access_level', userTenantRoles.access_level);
    }
    if (userTenantRoles.is_active !== undefined) {
      setValue('is_active', userTenantRoles.is_active);
    }
    if (userTenantRoles.notes) {
      setValue('notes', userTenantRoles.notes);
    }
  }, [setValue, userTenantRoles, isLoading, userId, tenantId]);

  if (isLoading) {
    return <div className='p-4 text-center'>Loading user tenant data...</div>;
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
            id={`edit-tenant-user-${section.id}`}
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
