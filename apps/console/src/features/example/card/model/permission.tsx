import { Card, Button, Icons } from '@ncobase/react';

import { CardLayout } from '../layout';

import { PermissionGuard } from '@/components/permission_guard';
import { useAuthContext } from '@/features/account/context';

export const PermissionPage = () => {
  const { isAdmin, roles, permissions, hasPermission, hasRole } = useAuthContext();
  return (
    <CardLayout>
      <h2 className='text-xl font-bold mb-4'>Permission System</h2>

      <div className='mb-6 p-4 bg-slate-50 rounded-md'>
        <h3 className='font-medium mb-2'>Current User Permissions:</h3>

        <div className='mb-4'>
          <span className='font-semibold'>Is Admin:</span> {isAdmin ? 'Yes' : 'No'}
        </div>

        <div className='mb-4'>
          <span className='font-semibold'>Roles:</span>
          <div className='mt-1 flex flex-wrap gap-2'>
            {roles.length > 0 ? (
              roles.map(role => (
                <span key={role} className='px-2 py-1 bg-slate-200 rounded-md text-sm'>
                  {role}
                </span>
              ))
            ) : (
              <span className='text-slate-500'>No roles assigned</span>
            )}
          </div>
        </div>

        <div>
          <span className='font-semibold'>Permissions:</span>
          <div className='mt-1 flex flex-wrap gap-2'>
            {permissions.length > 0 ? (
              permissions.map(perm => (
                <span key={perm} className='px-2 py-1 bg-slate-200 rounded-md text-sm'>
                  {perm}
                </span>
              ))
            ) : (
              <span className='text-slate-500'>No permissions assigned</span>
            )}
          </div>
        </div>
      </div>

      <h3 className='font-medium mb-3'>Permission-Based Components:</h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        <Card className='p-4'>
          <h4 className='font-medium mb-2'>Admin Actions</h4>
          <PermissionGuard
            // eslint-disable-next-line jsx-a11y/aria-role
            role='admin'
            fallback={<div className='text-red-500'>Admin access required</div>}
          >
            <Button className='w-full'>
              <Icons name='IconShieldLock' className='mr-2' />
              Admin Panel
            </Button>
          </PermissionGuard>
        </Card>

        <Card className='p-4'>
          <h4 className='font-medium mb-2'>User Management</h4>
          <PermissionGuard
            permission='create:user'
            fallback={<div className='text-red-500'>Missing create:user permission</div>}
          >
            <Button className='w-full'>
              <Icons name='IconUserPlus' className='mr-2' />
              Create User
            </Button>
          </PermissionGuard>
        </Card>

        <Card className='p-4'>
          <h4 className='font-medium mb-2'>Role Management</h4>
          <PermissionGuard
            permissions={['read:role', 'update:role']}
            fallback={<div className='text-red-500'>Missing role permissions</div>}
          >
            <Button className='w-full'>
              <Icons name='IconUsers' className='mr-2' />
              Manage Roles
            </Button>
          </PermissionGuard>
        </Card>

        <Card className='p-4'>
          <h4 className='font-medium mb-2'>Multiple Roles Check</h4>
          <PermissionGuard
            roles={['admin', 'editor']}
            any={true}
            fallback={<div className='text-red-500'>Need admin or editor role</div>}
          >
            <Button className='w-full'>
              <Icons name='IconEdit' className='mr-2' />
              Edit Content
            </Button>
          </PermissionGuard>
        </Card>
      </div>

      <div className='p-4 bg-slate-50 rounded-md'>
        <h3 className='font-medium mb-2'>Permission Check Results:</h3>
        <ul className='space-y-2'>
          <li>
            <span className='font-semibold'>has "admin / super-admin" role: </span>
            {hasRole(['admin', 'super-admin']) ? (
              <span className='text-green-500'>Yes</span>
            ) : (
              <span className='text-red-500'>No</span>
            )}
          </li>
          <li>
            <span className='font-semibold'>has "create:user" permission: </span>
            {hasPermission('create:user') ? (
              <span className='text-green-500'>Yes</span>
            ) : (
              <span className='text-red-500'>No</span>
            )}
          </li>
          <li>
            <span className='font-semibold'>has "delete:role" permission: </span>
            {hasPermission('delete:role') ? (
              <span className='text-green-500'>Yes</span>
            ) : (
              <span className='text-red-500'>No</span>
            )}
          </li>
        </ul>
      </div>
    </CardLayout>
  );
};
