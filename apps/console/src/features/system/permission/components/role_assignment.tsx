import { useState, useCallback } from 'react';

import { useToastMessage, Modal, InputField, Icons, Badge, Checkbox } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useListRoles } from '../../role/service';
import { Permission } from '../permission';

export const PermissionRoleAssignment = ({
  isOpen,
  onClose,
  permission,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  permission: Permission | null;
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: rolesData, isLoading } = useListRoles({ limit: 50, search: searchTerm });
  const roles = rolesData?.items || [];

  const filteredRoles = roles.filter(
    role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleToggle = useCallback((roleId: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  }, []);

  const handleAssign = useCallback(async () => {
    if (!permission?.id || selectedRoles.length === 0) return;

    try {
      // Call API to assign permissions to roles
      await Promise.all(
        selectedRoles.map(roleId =>
          fetch(`/api/roles/${roleId}/permissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ permissionIds: [permission.id] })
          })
        )
      );

      toast.success(t('messages.success'), {
        description: t('permission.messages.roles_assigned')
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('permission.messages.assign_failed')
      });
    }
  }, [permission?.id, selectedRoles, toast, t, onSuccess, onClose]);

  if (!permission) return null;

  return (
    <Modal
      isOpen={isOpen}
      onCancel={onClose}
      title={t('permission.assign_roles.title')}
      description={`${t('permission.assign_roles.description')} "${permission.name}"`}
      confirmText={t('actions.assign')}
      onConfirm={selectedRoles.length > 0 ? handleAssign : undefined}
      className='max-w-2xl'
    >
      <div className='space-y-4'>
        {/* Search */}
        <InputField
          placeholder={t('permission.assign_roles.search_placeholder')}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          prependIcon='IconSearch'
        />

        {/* Permission Info */}
        <div className='bg-slate-50 p-3 rounded-lg'>
          <div className='flex items-center space-x-2'>
            <Icons name='IconLock' className='w-4 h-4 text-slate-500' />
            <span className='font-medium'>{permission.name}</span>
            <Badge variant='outline-primary'>{permission.action}</Badge>
            <span className='text-slate-500'>→</span>
            <span className='text-slate-600 font-mono text-xs'>{permission.subject}</span>
          </div>
          {permission.description && (
            <p className='text-sm text-slate-600 mt-1'>{permission.description}</p>
          )}
        </div>

        {/* Roles List */}
        <div className='space-y-2 max-h-80 overflow-y-auto'>
          {isLoading ? (
            <div className='text-center py-4 text-slate-500'>{t('common.loading')}</div>
          ) : filteredRoles.length === 0 ? (
            <div className='text-center py-4 text-slate-500'>
              {searchTerm
                ? t('permission.assign_roles.no_results')
                : t('permission.assign_roles.no_roles')}
            </div>
          ) : (
            filteredRoles.map(role => (
              <div
                key={role.id}
                className='flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50'
              >
                <div className='flex items-center space-x-3'>
                  <Checkbox
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                  />
                  <div>
                    <div className='flex items-center space-x-2'>
                      <span className='font-medium'>{role.name}</span>
                      {role.disabled && (
                        <Badge variant='warning' size='xs'>
                          {t('common.disabled')}
                        </Badge>
                      )}
                    </div>
                    {role.slug && <span className='text-sm text-slate-500'>{role.slug}</span>}
                    {role.description && (
                      <p className='text-sm text-slate-600 mt-1'>{role.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Count */}
        {selectedRoles.length > 0 && (
          <div className='bg-blue-50 p-3 rounded-lg'>
            <span className='text-blue-800'>
              {t('permission.assign_roles.selected_count', { count: selectedRoles.length })}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
