import React, { useCallback, useEffect } from 'react';

import { Button, Modal } from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useAuthContext } from '@/features/account/context';
import { Tenant } from '@/features/system/tenant/tenant';
import { useRedirectFromUrl } from '@/router/router.hooks';

interface TenantOptionProps extends Tenant {
  isSelected: boolean;
  onSelect: (_id: string) => void;
}

const TenantOption = React.memo(
  ({ id, logo, name, slug, isSelected, onSelect }: TenantOptionProps) => {
    return (
      <Button
        variant='unstyle'
        className={cn(
          'px-3 py-6 bg-transparent hover:bg-slate-50 rounded-md w-full',
          isSelected && 'bg-slate-50 disabled hidden'
        )}
        onClick={() => onSelect(id)}
      >
        <div className='flex'>
          {logo && (
            <img
              src={logo}
              className='inline-flex items-center justify-center size-[1.75rem] font-medium rounded-full bg-slate-50'
              alt={name}
            />
          )}
          <div className='flex-1'>
            <p className='font-medium text-slate-800'>{name}</p>
            <p className='text-slate-400'>{slug || name}</p>
          </div>
        </div>
      </Button>
    );
  }
);

export const TenantSwitcher = ({
  opened = false,
  tenants = [],
  onVisible
}: {
  opened?: boolean;
  tenants?: Tenant[];
  onVisible?: (_visible: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { isAuthenticated, tenantId, switchTenant } = useAuthContext();
  const redirect = useRedirectFromUrl();

  const hasTenant = !!tenantId;

  const onSelect = useCallback(
    (id: string) => {
      if (id !== tenantId) {
        switchTenant(id);
        redirect();
      }
      if (onVisible) {
        onVisible(false);
      }
    },
    [tenantId, redirect, onVisible, switchTenant]
  );

  useEffect(() => {
    if (isAuthenticated && !hasTenant && tenants.length > 1 && onVisible) {
      onVisible(true);
    } else if (isAuthenticated && !hasTenant && tenants.length === 1) {
      onSelect(tenants[0].id);
    }
  }, [isAuthenticated, hasTenant, tenants.length, onSelect]);

  if (!tenants.length || !isAuthenticated) return null;

  return (
    <Modal
      title={t('tenant_switcher.title')}
      isOpen={opened}
      onChange={() => {
        if (onVisible) {
          onVisible(!opened);
        }
      }}
      className='max-w-80 max-h-40'
    >
      <div
        className={cn(
          'grid gap-2',
          tenants.filter((tenant: Tenant) => tenant.id !== tenantId).length > 1 && 'grid-cols-2'
        )}
      >
        {tenants.map((tenant: Tenant) => (
          <TenantOption
            key={tenant.id}
            {...tenant}
            isSelected={tenant.id === tenantId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </Modal>
  );
};
