import { useCallback, useState } from 'react';

import {
  Button,
  Icons,
  Badge,
  TableView,
  Tooltip,
  AlertDialog,
  useToastMessage,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger
} from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { SpaceUserBulkActions } from '../../components/user_bulk_actions';
import { SpaceUserRoleManagement } from '../../components/user_role_management';
import { useSpaceUserList } from '../../hooks/user';
import { useRemoveUserFromSpaceRole, useQuerySpace } from '../../service';

import { BulkActions } from '@/components/bulk_actions';
import { ErrorPage } from '@/components/errors';
import { Page, Topbar } from '@/components/layout';
import { ContentSearch } from '@/components/search/content';

export const SpaceUserListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { spaceId } = useParams<{ spaceId: string }>();
  const toast = useToastMessage();

  // Ensure spaceId exists
  if (!spaceId) {
    return (
      <Page>
        <ErrorPage
          code={400}
          title={t('space.users.errors.no_space_id')}
          description={t('space.users.errors.invalid_space')}
        />
      </Page>
    );
  }

  const [searchParams, setSearchParams] = useState({
    search: '',
    role_id: '',
    access_level: '',
    is_active: '',
    limit: 50
  });
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [roleManagementModal, setRoleManagementModal] = useState<{
    open: boolean;
    user: any | null;
  }>({ open: false, user: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: any | null;
  }>({ open: false, user: null });

  // Data fetching
  const { data: space } = useQuerySpace(spaceId);
  const { data: userData, loading, refetch } = useSpaceUserList(spaceId, searchParams);
  const removeUserMutation = useRemoveUserFromSpaceRole();

  const users = userData?.users || [];

  const handleSearch = useCallback((query: string, filters: any) => {
    setSearchParams(prev => ({
      ...prev,
      search: query,
      role_id: filters.role || '',
      access_level: filters.access_level || '',
      is_active: filters.status || '',
      cursor: ''
    }));
  }, []);

  const handleToggleSelect = useCallback((user: any) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(selected => selected.user_id === user.user_id);
      return isSelected
        ? prev.filter(selected => selected.user_id !== user.user_id)
        : [...prev, user];
    });
  }, []);

  const handleBulkDelete = useCallback(
    async (userIds: string[]) => {
      try {
        // Remove all roles for selected users from space
        const promises = userIds.map(async userId => {
          const user = users.find(u => u.user_id === userId);
          if (user?.role_ids) {
            return Promise.all(
              user.role_ids.map((roleId: string) =>
                removeUserMutation.mutateAsync({ spaceId, userId, roleId })
              )
            );
          }
          return Promise.resolve();
        });

        await Promise.all(promises);
        toast.success(t('messages.success'), {
          description: t('space.users.messages.bulk_remove_success')
        });
        setSelectedUsers([]);
        refetch();
      } catch (error) {
        toast.error(t('messages.error'), {
          description: error['message'] || t('space.users.messages.bulk_remove_failed')
        });
      }
    },
    [users, removeUserMutation, spaceId, toast, t, refetch]
  );

  const handleDelete = useCallback((user: any) => {
    setDeleteDialog({ open: true, user });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteDialog.user) return;

    try {
      const userRoles = deleteDialog.user.role_ids || [];
      if (userRoles.length > 0) {
        await Promise.all(
          userRoles.map((roleId: string) =>
            removeUserMutation.mutateAsync({
              spaceId,
              userId: deleteDialog.user.user_id,
              roleId
            })
          )
        );
      }

      toast.success(t('messages.success'), {
        description: t('space.users.messages.remove_success')
      });
      setDeleteDialog({ open: false, user: null });
      refetch();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.users.messages.remove_failed')
      });
      setDeleteDialog({ open: false, user: null });
    }
  }, [deleteDialog.user, removeUserMutation, spaceId, toast, t, refetch]);

  const handleRoleManagement = useCallback((user: any) => {
    setRoleManagementModal({ open: true, user });
  }, []);

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
      <Badge variant={config.variant} className='flex items-center gap-1 px-2 py-1'>
        <Icons name={config.icon} size={12} />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge
        variant={isActive ? 'success' : 'secondary'}
        className='flex items-center gap-1 px-2 py-1'
      >
        <Icons name={isActive ? 'IconUserCheck' : 'IconUserX'} size={12} />
        {isActive ? t('space.users.status.active') : t('space.users.status.inactive')}
      </Badge>
    );
  };

  const renderUserActions = (user: any) => (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
          <Icons name='IconDots' size={16} />
        </Button>
      </DropdownTrigger>
      <DropdownContent align='end' className='w-48'>
        <DropdownItem onClick={() => navigate(`/spaces/${spaceId}/users/view/${user.user_id}`)}>
          <Icons name='IconEye' className='mr-2' size={16} />
          {t('space.users.actions.view')}
        </DropdownItem>
        <DropdownItem onClick={() => navigate(`/spaces/${spaceId}/users/edit/${user.user_id}`)}>
          <Icons name='IconPencil' className='mr-2' size={16} />
          {t('space.users.actions.edit')}
        </DropdownItem>
        <DropdownItem onClick={() => handleRoleManagement(user)}>
          <Icons name='IconUserCheck' className='mr-2' size={16} />
          {t('space.users.actions.manage_roles')}
        </DropdownItem>
        <DropdownItem
          onClick={() => handleDelete(user)}
          className='text-red-600 focus:text-red-600 border-t mt-1 pt-1'
        >
          <Icons name='IconTrash' className='mr-2' size={16} />
          {t('space.users.actions.remove')}
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );

  // Table columns configuration
  const columns = [
    {
      title: t('space.users.fields.username'),
      dataIndex: 'username',
      parser: (_: any, user: any) => (
        <div className='flex items-center space-x-3'>
          <div className='flex-shrink-0'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm'>
              <Icons name='IconUser' size={20} className='text-white' />
            </div>
          </div>
          <div className='min-w-0 flex-1'>
            <Button
              variant='link'
              size='lg'
              className='px-0 h-auto min-h-auto font-semibold text-left'
              onClick={e => {
                e.stopPropagation();
                navigate(`/spaces/${spaceId}/users/view/${user.user_id}`);
              }}
            >
              {user.username || user.user_id}
            </Button>
            <div className='text-xs text-gray-500 mt-1'>{user.email}</div>
          </div>
        </div>
      )
    },
    {
      title: t('space.users.fields.roles'),
      dataIndex: 'role_ids',
      width: 200,
      parser: (_: any, user: any) => {
        const roleIds = user.role_ids || [];
        if (roleIds.length === 0) {
          return <span className='text-gray-500 text-sm'>{t('space.users.no_roles')}</span>;
        }
        return (
          <div className='flex flex-wrap gap-1'>
            {roleIds.slice(0, 2).map((roleId: string) => (
              <Badge key={roleId} variant='outline-primary' size='sm'>
                {roleId}
              </Badge>
            ))}
            {roleIds.length > 2 && (
              <Badge variant='secondary' size='sm'>
                +{roleIds.length - 2}
              </Badge>
            )}
          </div>
        );
      }
    },
    {
      title: t('space.users.fields.access_level'),
      dataIndex: 'access_level',
      width: 140,
      parser: (_: any, user: any) => getAccessLevelBadge(user.access_level || 'standard')
    },
    {
      title: t('space.users.fields.status'),
      dataIndex: 'is_active',
      width: 120,
      parser: (_: any, user: any) => getStatusBadge(user.is_active !== false)
    },
    {
      title: t('space.users.fields.joined_at'),
      dataIndex: 'joined_at',
      width: 140,
      parser: (joined_at: string) => {
        if (!joined_at) return '-';
        return (
          <Tooltip content={formatDateTime(joined_at, 'dateTime')}>
            <span className='text-sm text-gray-500'>{formatRelativeTime(new Date(joined_at))}</span>
          </Tooltip>
        );
      }
    },
    {
      title: t('common.actions'),
      filter: false,
      width: 60,
      parser: (_: any, user: any) => renderUserActions(user)
    }
  ];

  const filterOptions = {
    access_levels: [
      { label: t('space.users.access_levels.limited'), value: 'limited' },
      { label: t('space.users.access_levels.standard'), value: 'standard' },
      { label: t('space.users.access_levels.elevated'), value: 'elevated' },
      { label: t('space.users.access_levels.admin'), value: 'admin' }
    ],
    statuses: [
      { label: t('space.users.status.active'), value: 'true' },
      { label: t('space.users.status.inactive'), value: 'false' }
    ]
  };

  if (loading) {
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

  return (
    <Page
      title={t('space.users.title')}
      topbar={
        <Topbar
          title={t('space.users.title')}
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/spaces')}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back_to_spaces')}
            </Button>
          ]}
          right={[
            <Button
              size='sm'
              onClick={() => navigate(`/spaces/${spaceId}/users/create`)}
              className='flex items-center gap-2'
            >
              <Icons name='IconPlus' size={16} />
              {t('space.users.add_user')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-6'
    >
      {/* Space Info Header */}
      {space && (
        <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100'>
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
              <h1 className='text-2xl font-bold text-gray-900 mb-1'>
                {space.name} {t('space.users.title')}
              </h1>
              <p className='text-gray-600'>
                {t('space.users.description_with_count', {
                  count: users.length,
                  defaultValue: 'Manage user access and permissions for this space'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Search */}
      <ContentSearch
        onSearch={handleSearch}
        placeholder={t('space.users.search_placeholder', 'Search by username or email')}
        showFilters={true}
        filterOptions={filterOptions}
      />

      {/* Users List */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        {users.length > 0 ? (
          <TableView
            header={columns}
            selected
            data={users}
            onSelectRow={row => handleToggleSelect(row)}
            onSelectAllRows={rows => setSelectedUsers(rows)}
            className='[&_table]:border-0'
          />
        ) : (
          <div className='text-center py-16'>
            <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
              <Icons name='IconUsers' size={32} className='text-white' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {t('space.users.empty.title', 'No users found')}
            </h3>
            <p className='text-sm text-gray-500 mb-6 max-w-sm mx-auto'>
              {t(
                'space.users.empty.description',
                'Add users to this space to start collaborating.'
              )}
            </p>
            <Button
              size='sm'
              onClick={() => navigate(`/spaces/${spaceId}/users/create`)}
              className='inline-flex items-center gap-2'
            >
              <Icons name='IconPlus' size={16} />
              {t('space.users.add_first_user')}
            </Button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <BulkActions
        selectedItems={selectedUsers}
        onClearSelection={() => setSelectedUsers([])}
        onBulkDelete={ids => handleBulkDelete(ids)}
        customActions={[
          {
            label: t('space.users.bulk.assign_roles'),
            icon: 'IconUserPlus',
            onClick: ids => console.log('Bulk assign roles:', ids),
            variant: 'primary'
          }
        ]}
      />

      {/* Bulk Actions Component (Space-specific) */}
      <SpaceUserBulkActions
        spaceId={spaceId}
        selectedUsers={selectedUsers}
        onSelectionChange={setSelectedUsers}
        onSuccess={() => {
          toast.success(t('messages.success'), {
            description: t('space.users.messages.bulk_success')
          });
          refetch();
        }}
      />

      {/* Role Management Modal */}
      <SpaceUserRoleManagement
        isOpen={roleManagementModal.open}
        onClose={() => setRoleManagementModal({ open: false, user: null })}
        spaceId={spaceId}
        user={roleManagementModal.user}
        onSuccess={() => {
          setRoleManagementModal({ open: false, user: null });
          refetch();
        }}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog
        title={t('space.users.dialogs.remove_title')}
        description={t('space.users.dialogs.remove_description')}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !deleteDialog.open }))}
        cancelText={t('actions.cancel')}
        confirmText={t('actions.remove')}
        onCancel={() => setDeleteDialog({ open: false, user: null })}
        onConfirm={confirmDelete}
      />
    </Page>
  );
};
