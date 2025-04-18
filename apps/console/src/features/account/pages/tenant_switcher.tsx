import React, { useCallback, useEffect } from 'react';

import { Button, Modal } from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useAuthContext } from '@/features/account/context';
import { useTenantContext } from '@/features/system/tenant/context';
import { Tenant } from '@/features/system/tenant/tenant';
import { useRedirectFromUrl } from '@/router/router.hooks';

interface TenantOptionProps extends Tenant {
  isSelected: boolean;
  // eslint-disable-next-line no-unused-vars
  onSelect: (id: string) => void;
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
  // eslint-disable-next-line no-unused-vars
  onVisible?: (visible: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthContext();
  const { hasTenant, tenant_id, updateTenant } = useTenantContext();
  const redirect = useRedirectFromUrl();

  const onSelect = useCallback(
    (id: string) => {
      if (id !== tenant_id) {
        updateTenant(id);
        redirect();
      }
      onVisible?.(false);
    },
    [tenant_id, redirect, onVisible, updateTenant]
  );

  useEffect(() => {
    if (isAuthenticated && !hasTenant && tenants.length > 1) {
      onVisible(true);
    } else if (isAuthenticated && !hasTenant && tenants.length === 1) {
      onSelect(tenants[0].id);
    }
  }, [isAuthenticated, hasTenant, tenants, onSelect]);

  if (!tenants.length || !isAuthenticated) return null;

  return (
    <Modal
      title={t('tenant_switcher.title')}
      isOpen={opened}
      onChange={() => {
        onVisible?.(!opened);
      }}
      className='max-w-80 max-h-40'
    >
      <div
        className={cn(
          'grid gap-2',
          tenants.filter((tenant: Tenant) => tenant.id !== tenant_id).length > 1 && 'grid-cols-2'
        )}
      >
        {tenants.map((tenant: Tenant) => (
          <TenantOption
            key={tenant.id}
            {...tenant}
            isSelected={tenant.id === tenant_id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </Modal>
  );
};
