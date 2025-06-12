import { FieldViewer, Section, Skeleton, Badge } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useListRoles } from '../../../role/service';
import { useQueryUser } from '../../../user/service';
import { useQueryUserSpaceRoles } from '../../service';

interface ViewerSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  fields: ViewerField[];
}

interface ViewerField {
  id: string;
  title: string;
  accessor: string;
  renderer?: (_value: any, _data?: any) => React.ReactNode;
  className?: string;
}

export const SpaceUserViewerForm = ({ spaceId, userId }) => {
  const { t } = useTranslation();
  const { data: userSpaceData, isLoading } = useQueryUserSpaceRoles(spaceId, userId);
  const { data: userData } = useQueryUser(userId);
  const { data: rolesData } = useListRoles({ limit: 100 });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const roles = rolesData?.items || [];
  const data = { ...userData, ...userSpaceData };

  const viewerSections: ViewerSection[] = [
    {
      id: 'user_basic',
      title: t('space.users.section.user_basic', 'User Information'),
      subtitle: t('space.users.section.user_basic_subtitle', 'Basic user details'),
      icon: 'IconUser',
      fields: [
        {
          id: 'user_id',
          title: t('space.users.fields.user_id', 'User ID'),
          accessor: 'user_id'
        },
        {
          id: 'username',
          title: t('space.users.fields.username', 'Username'),
          accessor: 'username'
        },
        {
          id: 'email',
          title: t('space.users.fields.email', 'Email'),
          accessor: 'email'
        },
        {
          id: 'phone',
          title: t('space.users.fields.phone', 'Phone'),
          accessor: 'phone'
        },
        {
          id: 'status',
          title: t('space.users.fields.user_status', 'User Status'),
          accessor: 'status',
          renderer: value => renderUserStatus(value, t)
        },
        {
          id: 'is_certified',
          title: t('space.users.fields.certified', 'Certified'),
          accessor: 'is_certified',
          renderer: value => renderBoolean(value, t)
        }
      ]
    },
    {
      id: 'space_roles',
      title: t('space.users.section.space_roles', 'Space Roles'),
      subtitle: t('space.users.section.space_roles_subtitle', 'Assigned roles in this space'),
      icon: 'IconUserCheck',
      fields: [
        {
          id: 'role_ids',
          title: t('space.users.fields.assigned_roles', 'Assigned Roles'),
          accessor: 'role_ids',
          renderer: value => renderRoles(value, roles, t),
          className: 'col-span-full'
        },
        {
          id: 'joined_at',
          title: t('space.users.fields.joined_at', 'Joined Space'),
          accessor: 'joined_at',
          renderer: value => formatDateTime(value) || t('space.users.unknown_join_date')
        },
        {
          id: 'is_active',
          title: t('space.users.fields.is_active', 'Active in Space'),
          accessor: 'is_active',
          renderer: value => renderSpaceStatus(value, t)
        }
      ]
    },
    {
      id: 'space_specific',
      title: t('space.users.section.space_specific', 'Space-Specific Settings'),
      subtitle: t('space.users.section.space_specific_subtitle', 'Custom settings for this space'),
      icon: 'IconSettings',
      fields: [
        {
          id: 'custom_title',
          title: t('space.users.fields.custom_title', 'Custom Title'),
          accessor: 'custom_title'
        },
        {
          id: 'department',
          title: t('space.users.fields.department', 'Department'),
          accessor: 'department',
          renderer: value => (value ? t(`departments.${value}`) : '-')
        },
        {
          id: 'access_level',
          title: t('space.users.fields.access_level', 'Access Level'),
          accessor: 'access_level',
          renderer: value => renderAccessLevel(value, t)
        },
        {
          id: 'notes',
          title: t('space.users.fields.notes', 'Notes'),
          accessor: 'notes',
          className: 'col-span-full'
        }
      ]
    },
    {
      id: 'system_info',
      title: t('space.users.section.system_info', 'System Information'),
      subtitle: t('space.users.section.system_info_subtitle', 'System-generated data'),
      icon: 'IconDatabase',
      fields: [
        {
          id: 'user_created_at',
          title: t('space.users.fields.user_created_at', 'User Created'),
          accessor: 'created_at',
          renderer: value => formatDateTime(value)
        },
        {
          id: 'last_login',
          title: t('space.users.fields.last_login', 'Last Login'),
          accessor: 'last_login',
          renderer: value => formatDateTime(value) || t('space.users.never_logged_in')
        },
        {
          id: 'space_id',
          title: t('space.users.fields.space_id', 'Space ID'),
          accessor: 'space_id'
        },
        {
          id: 'relationship_id',
          title: t('space.users.fields.relationship_id', 'Relationship ID'),
          accessor: 'relationship_id'
        }
      ]
    }
  ];

  return (
    <>
      {viewerSections.map(section => (
        <Section key={section.id} title={section.title} icon={section.icon} className='mb-6'>
          <div className='grid grid-cols-2 gap-4'>
            {section.fields.map(field => (
              <FieldViewer key={field.id} title={field.title} className={field.className}>
                {field.renderer
                  ? field.renderer(data[field.accessor], data)
                  : data[field.accessor] || '-'}
              </FieldViewer>
            ))}
          </div>
        </Section>
      ))}
    </>
  );
};

const LoadingSkeleton = () => (
  <div className='space-y-4'>
    <Skeleton className='h-8 w-40 mb-4' />
    <div className='space-y-2'>
      <Skeleton className='h-12 w-full' />
      <Skeleton className='h-12 w-full' />
      <Skeleton className='h-12 w-full' />
      <Skeleton className='h-12 w-full' />
      <Skeleton className='h-12 w-full' />
    </div>
  </div>
);

const renderUserStatus = (status: number, t: any) => {
  const statusConfig = {
    0: { label: t('user.status.active'), variant: 'success' as const },
    1: { label: t('user.status.inactive'), variant: 'warning' as const },
    2: { label: t('user.status.disabled'), variant: 'danger' as const }
  };

  const config = statusConfig[status] || { label: 'Unknown', variant: 'secondary' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const renderSpaceStatus = (isActive: boolean, t: any) => {
  return isActive ? (
    <Badge variant='success'>{t('space.users.status.active')}</Badge>
  ) : (
    <Badge variant='danger'>{t('space.users.status.inactive')}</Badge>
  );
};

const renderBoolean = (value: boolean, t: any) => {
  return value ? (
    <Badge variant='success'>{t('common.yes')}</Badge>
  ) : (
    <Badge variant='secondary'>{t('common.no')}</Badge>
  );
};

const renderRoles = (roleIds: string[], roles: any[], t: any) => {
  if (!roleIds || roleIds.length === 0) {
    return <span className='text-slate-500'>{t('space.users.no_roles')}</span>;
  }

  return (
    <div className='flex flex-wrap gap-1'>
      {roleIds.map(roleId => {
        const role = roles.find(r => r.id === roleId);
        return (
          <Badge key={roleId} variant='outline-primary' className='bg-slate-50'>
            {role ? role.name : roleId}
          </Badge>
        );
      })}
    </div>
  );
};

const renderAccessLevel = (level: string, t: any) => {
  if (!level) return '-';

  const levelColors = {
    limited: 'bg-red-100 text-red-800',
    standard: 'bg-blue-100 text-blue-800',
    elevated: 'bg-purple-100 text-purple-800',
    admin: 'bg-orange-100 text-orange-800'
  };

  return (
    <Badge className={levelColors[level] || 'bg-slate-100'}>
      {t(`space.users.access_levels.${level}`)}
    </Badge>
  );
};
