import { useState } from 'react';

import {
  Button,
  InputField,
  SelectField,
  Badge,
  Icons,
  useToastMessage,
  Modal,
  Checkbox
} from '@ncobase/react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useListRoles } from '../../role/service';
import {
  useQuerySpaceUsers,
  useAddUserToSpaceRole,
  useRemoveUserFromSpaceRole,
  useBulkUpdateUserSpaceRoles
} from '../service';

interface SpaceUserManagementProps {
  space: any;
}

export const SpaceUserManagement: React.FC<SpaceUserManagementProps> = ({ space }) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    role_id: '',
    search: ''
  });

  const { data: users, isLoading, refetch } = useQuerySpaceUsers(space?.id, filters);
  const { data: rolesData } = useListRoles({ limit: 100 });
  const addUserMutation = useAddUserToSpaceRole();
  const removeUserMutation = useRemoveUserFromSpaceRole();
  const bulkUpdateMutation = useBulkUpdateUserSpaceRoles();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const roles = rolesData?.items || [];

  const handleAddUser = () => {
    reset({ space_id: space.id });
    setShowAddForm(true);
  };

  const handleRemoveUser = async (userId: string, roleId: string) => {
    try {
      await removeUserMutation.mutateAsync({
        spaceId: space.id,
        userId,
        roleId
      });
      toast.success(t('messages.success'), {
        description: t('space.users.remove_success')
      });
      refetch();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.users.remove_failed')
      });
    }
  };

  const handleBulkAction = async (action: string, roleId?: string) => {
    if (selectedUsers.length === 0) return;

    try {
      const updates = selectedUsers.map(userId => ({
        user_id: userId,
        role_id: roleId || '',
        operation: action
      })) as any;

      await bulkUpdateMutation.mutateAsync({
        updates,
        spaceId: space.id
      });

      toast.success(t('messages.success'), {
        description: t('space.users.bulk_success')
      });
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.users.bulk_failed')
      });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await addUserMutation.mutateAsync({
        spaceId: space.id,
        ...data
      });
      toast.success(t('messages.success'), {
        description: t('space.users.add_success')
      });
      setShowAddForm(false);
      reset();
      refetch();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.users.add_failed')
      });
    }
  };

  const handleUserSelect = (userId: string, checked: boolean) => {
    setSelectedUsers(prev => (checked ? [...prev, userId] : prev.filter(id => id !== userId)));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? users?.users?.map(u => u.user_id) || [] : []);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-medium'>{t('space.users.title')}</h3>
          <p className='text-slate-600'>{t('space.users.description')}</p>
        </div>
        <Button onClick={handleAddUser}>
          <Icons name='IconPlus' className='mr-2' />
          {t('space.users.add')}
        </Button>
      </div>

      {/* Filters */}
      <div className='bg-slate-50 p-4 rounded-lg'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 px-2'>
          <InputField
            placeholder={t('space.users.search_placeholder')}
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            prependIcon='IconSearch'
          />

          <SelectField
            placeholder={t('space.users.filter_role')}
            value={filters.role_id}
            onChange={value => setFilters(prev => ({ ...prev, role_id: value }))}
            options={roles.map(role => ({ label: role.name, value: role.id }))}
            allowClear
          />

          <Button variant='outline-slate' onClick={() => setFilters({ role_id: '', search: '' })}>
            {t('actions.clear')}
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
          <div className='flex items-center justify-between'>
            <span className='text-blue-800'>
              {t('space.users.selected_count', { count: selectedUsers.length })}
            </span>
            <div className='flex items-center space-x-2'>
              <SelectField
                placeholder={t('space.users.bulk_assign_role')}
                options={roles.map(role => ({ label: role.name, value: role.id }))}
                onChange={roleId => handleBulkAction('add', roleId)}
                className='min-w-[200px]'
              />
              <Button variant='outline-danger' size='sm' onClick={() => handleBulkAction('remove')}>
                {t('space.users.bulk_remove')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* User List */}
      <div className='bg-white rounded-lg border border-slate-200/60 '>
        {isLoading ? (
          <div className='p-8 text-center'>
            <Icons name='IconLoader' className='animate-spin mx-auto mb-4' />
            {t('common.loading')}
          </div>
        ) : !users?.users?.length ? (
          <div className='p-8 text-center text-slate-500'>
            <Icons name='IconUsers' className='w-12 h-12 mx-auto mb-4 text-slate-300' />
            {t('space.users.no_users')}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b bg-slate-50'>
                  <th className='px-4 py-3 text-left'>
                    <Checkbox
                      checked={selectedUsers.length === users.users.length}
                      onChange={e => handleSelectAll(e.target['checked'])}
                    />
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-slate-900'>
                    {t('space.users.fields.user_id')}
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-slate-900'>
                    {t('space.users.fields.username')}
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-slate-900'>
                    {t('space.users.fields.email')}
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-slate-900'>
                    {t('space.users.fields.roles')}
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-slate-900'>
                    {t('space.users.fields.joined_at')}
                  </th>
                  <th className='px-4 py-3 text-center font-medium text-slate-900'>
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {users.users.map((user: any) => (
                  <UserRow
                    key={user.user_id}
                    user={user}
                    roles={roles}
                    selected={selectedUsers.includes(user.user_id)}
                    onSelect={handleUserSelect}
                    onRemove={handleRemoveUser}
                    t={t}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Form Modal */}
      <Modal
        isOpen={showAddForm}
        onCancel={() => {
          setShowAddForm(false);
          reset();
        }}
        title={t('space.users.add_title')}
        confirmText={t('actions.add')}
        onConfirm={handleSubmit(onSubmit)}
      >
        <div className='space-y-4'>
          <Controller
            name='user_id'
            control={control}
            rules={{ required: t('forms.input_required') }}
            render={({ field }) => (
              <InputField
                label={t('space.users.fields.user_id')}
                placeholder={t('space.users.placeholders.user_id')}
                error={errors.user_id?.message}
                {...field}
              />
            )}
          />

          <Controller
            name='role_id'
            control={control}
            rules={{ required: t('forms.select_required') }}
            render={({ field }) => (
              <SelectField
                label={t('space.users.fields.role')}
                options={roles.map(role => ({ label: role.name, value: role.id }))}
                error={errors.role_id?.message}
                {...field}
              />
            )}
          />
        </div>
      </Modal>
    </div>
  );
};

const UserRow = ({ user, roles, selected, onSelect, onRemove, t }: any) => {
  const getRoleNames = (roleIds: string[]) => {
    return roleIds
      .map(roleId => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : roleId;
      })
      .join(', ');
  };

  return (
    <tr className='hover:bg-slate-50'>
      <td className='px-4 py-3'>
        <Checkbox checked={selected} onChange={e => onSelect(user.user_id, e.target['checked'])} />
      </td>
      <td className='px-4 py-3 font-mono text-xs'>{user.user_id}</td>
      <td className='px-4 py-3 font-medium'>{user.username || '-'}</td>
      <td className='px-4 py-3'>{user.email || '-'}</td>
      <td className='px-4 py-3'>
        <div className='flex flex-wrap gap-1'>
          {user.role_ids?.map((roleId: string) => (
            <Badge key={roleId} variant='outline-primary' size='sm'>
              {roles.find(r => r.id === roleId)?.name || roleId}
            </Badge>
          ))}
        </div>
      </td>
      <td className='px-4 py-3 text-sm text-slate-600'>
        {user.joined_at ? new Date(user.joined_at).toLocaleDateString() : '-'}
      </td>
      <td className='px-4 py-3'>
        <div className='flex items-center justify-center space-x-2'>
          {user.role_ids?.map((roleId: string) => (
            <Button
              key={roleId}
              variant='outline-danger'
              size='xs'
              onClick={() => onRemove(user.user_id, roleId)}
              title={t('space.users.remove_role')}
            >
              <Icons name='IconX' size={12} />
            </Button>
          ))}
        </div>
      </td>
    </tr>
  );
};
