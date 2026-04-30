import { useCallback, useEffect, useMemo, useState } from 'react';

import { Badge, Checkbox, Icons, InputField, Modal, useToastMessage } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import type { Permission } from '../../permission/permission';
import { useListPermissions } from '../../permission/service';
import type { Role } from '../role';
import { useAssignPermissions, useQueryRolePermissions, useRemovePermissions } from '../service';

interface RolePermissionAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSuccess?: () => void;
}

const normalizePermissions = (payload: any): Permission[] => {
  const items = Array.isArray(payload) ? payload : payload?.items || [];
  return items
    .map((item: any) => {
      if (item?.permission) return item.permission;
      return item;
    })
    .filter(Boolean);
};

const normalizePermissionIds = (payload: any): string[] => {
  const items = Array.isArray(payload) ? payload : payload?.items || [];
  return items
    .map((item: any) => item?.permission_id || item?.permission?.id || item?.id)
    .filter(Boolean);
};

export const RolePermissionAssignment: React.FC<RolePermissionAssignmentProps> = ({
  isOpen,
  onClose,
  role,
  onSuccess
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

  const { data: permissionsData, isLoading: isLoadingPermissions } = useListPermissions({
    limit: 100,
    search: searchTerm
  });
  const { data: rolePermissionsData, isLoading: isLoadingRolePermissions } =
    useQueryRolePermissions(role?.id || '');
  const assignPermissionsMutation = useAssignPermissions();
  const removePermissionsMutation = useRemovePermissions();

  const permissions = useMemo(() => normalizePermissions(permissionsData), [permissionsData]);
  const originalPermissionIds = useMemo(
    () => normalizePermissionIds(rolePermissionsData),
    [rolePermissionsData]
  );

  useEffect(() => {
    if (isOpen && role?.id) {
      setSelectedPermissionIds(originalPermissionIds);
    }
  }, [isOpen, role?.id, originalPermissionIds.join('|')]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedPermissionIds([]);
    }
  }, [isOpen]);

  const filteredPermissions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return permissions;
    return permissions.filter(permission =>
      [
        permission.name,
        permission.action,
        permission.subject,
        permission.group,
        permission.description
      ]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(query))
    );
  }, [permissions, searchTerm]);

  const handlePermissionToggle = useCallback((permissionId: string) => {
    setSelectedPermissionIds(prev =>
      prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!role?.id) return;

    const nextIds = selectedPermissionIds.filter(Boolean);
    const addedIds = nextIds.filter(id => !originalPermissionIds.includes(id));
    const removedIds = originalPermissionIds.filter(id => !nextIds.includes(id));

    try {
      if (addedIds.length > 0) {
        await assignPermissionsMutation.mutateAsync({
          roleId: role.id,
          permissionIds: addedIds
        });
      }
      if (removedIds.length > 0) {
        await removePermissionsMutation.mutateAsync({
          roleId: role.id,
          permissionIds: removedIds
        });
      }

      toast.success(t('messages.success'), {
        description: t('role.permissions.save_success', 'Role permissions updated')
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(t('messages.error'), {
        description:
          error['message'] || t('role.permissions.save_failed', 'Failed to update role permissions')
      });
    }
  }, [
    role?.id,
    selectedPermissionIds,
    originalPermissionIds,
    assignPermissionsMutation,
    removePermissionsMutation,
    toast,
    t,
    onSuccess,
    onClose
  ]);

  if (!role) return null;

  const isSaving = assignPermissionsMutation.isPending || removePermissionsMutation.isPending;
  const isLoading = isLoadingPermissions || isLoadingRolePermissions;

  return (
    <Modal
      isOpen={isOpen}
      onCancel={onClose}
      title={t('role.permissions.title', 'Manage Role Permissions')}
      description={t('role.permissions.description', {
        defaultValue: 'Assign permissions to "{{role}}"',
        role: role.name || role.slug || role.id
      })}
      confirmText={t('actions.save', 'Save')}
      confirmDisabled={isSaving || isLoading}
      onConfirm={handleSave}
      className='max-w-3xl'
    >
      <div className='space-y-4'>
        <div className='rounded-lg border border-slate-200 bg-slate-50 p-3'>
          <div className='flex flex-wrap items-center gap-2'>
            <Icons name='IconShield' className='text-slate-500' size={16} />
            <span className='font-medium'>{role.name || role.slug || role.id}</span>
            {role.slug && <Badge variant='outline-slate'>{role.slug}</Badge>}
            {role.disabled && <Badge variant='warning'>{t('common.disabled')}</Badge>}
          </div>
          {role.description && <p className='mt-2 text-sm text-slate-600'>{role.description}</p>}
        </div>

        <InputField
          placeholder={t('permission.placeholders.search', 'Search by name or description')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          prependIcon='IconSearch'
        />

        <div className='max-h-96 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-2'>
          {isLoading ? (
            <div className='py-8 text-center text-slate-500'>{t('common.loading')}</div>
          ) : filteredPermissions.length === 0 ? (
            <div className='py-8 text-center text-slate-500'>
              {t('role.permissions.no_results', 'No matching permissions found')}
            </div>
          ) : (
            filteredPermissions.map(permission => {
              const permissionId = permission.id || '';
              const checked = selectedPermissionIds.includes(permissionId);
              return (
                <label
                  key={permissionId}
                  className='flex cursor-pointer items-start justify-between gap-4 rounded-md border border-slate-100 p-3 hover:bg-slate-50'
                >
                  <div className='flex min-w-0 gap-3'>
                    <Checkbox
                      checked={checked}
                      onChange={() => permissionId && handlePermissionToggle(permissionId)}
                    />
                    <div className='min-w-0'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <span className='font-medium'>{permission.name || permissionId}</span>
                        {permission.default && (
                          <Badge variant='primary' size='xs'>
                            {t('permission.labels.default')}
                          </Badge>
                        )}
                        {permission.disabled && (
                          <Badge variant='warning' size='xs'>
                            {t('common.disabled')}
                          </Badge>
                        )}
                      </div>
                      <div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500'>
                        <Badge variant='outline-primary'>{permission.action || '*'}</Badge>
                        <span className='font-mono'>{permission.subject || '*'}</span>
                        {permission.group && <span>{permission.group}</span>}
                      </div>
                      {permission.description && (
                        <p className='mt-1 line-clamp-2 text-sm text-slate-600'>
                          {permission.description}
                        </p>
                      )}
                    </div>
                  </div>
                </label>
              );
            })
          )}
        </div>

        <div className='rounded-lg bg-blue-50 p-3 text-sm text-blue-800'>
          {t('role.permissions.selected_count', {
            defaultValue: '{{count}} permissions selected',
            count: selectedPermissionIds.length
          })}
        </div>
      </div>
    </Modal>
  );
};
