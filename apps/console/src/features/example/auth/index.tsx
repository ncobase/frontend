import { useState } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icons,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableView
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { Page, Topbar } from '@/components/layout';

type Permission = {
  id: string;
  name: string;
  description: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

type User = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  lastLogin?: Date;
};

const permissions: Permission[] = [
  { id: 'view_dashboard', name: '查看仪表盘', description: '允许用户查看仪表盘数据' },
  { id: 'create_project', name: '创建项目', description: '允许用户创建新项目' },
  { id: 'edit_project', name: '编辑项目', description: '允许用户编辑现有项目' },
  { id: 'delete_project', name: '删除项目', description: '允许用户删除项目' },
  { id: 'view_users', name: '查看用户', description: '允许查看用户列表' },
  { id: 'edit_users', name: '编辑用户', description: '允许编辑用户信息' },
  { id: 'assign_roles', name: '分配角色', description: '允许为用户分配角色' },
  { id: 'manage_roles', name: '管理角色', description: '允许管理角色和权限' }
];

const roles: Role[] = [
  {
    id: 'admin',
    name: '管理员',
    description: '系统管理员，拥有所有权限',
    permissions: permissions.map(p => p.id)
  },
  {
    id: 'manager',
    name: '项目经理',
    description: '可以创建和管理项目，但无法管理用户',
    permissions: [
      'view_dashboard',
      'create_project',
      'edit_project',
      'delete_project',
      'view_users'
    ]
  },
  {
    id: 'user',
    name: '普通用户',
    description: '只能查看和参与项目',
    permissions: ['view_dashboard', 'view_users']
  }
];

const users: User[] = [
  {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    roles: ['admin'],
    lastLogin: new Date(2025, 3, 15, 10, 30)
  },
  {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    roles: ['manager'],
    lastLogin: new Date(2025, 3, 14, 9, 15)
  },
  {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    roles: ['user'],
    lastLogin: new Date(2025, 3, 10, 14, 45)
  },
  {
    id: '4',
    name: '赵六',
    email: 'zhaoliu@example.com',
    roles: ['user'],
    lastLogin: new Date(2025, 3, 8, 11, 20)
  }
];

const Guard = ({ requiredPermission, currentRole, children }) => {
  const hasPermission = () => {
    if (!currentRole) return false;
    const role = roles.find(r => r.id === currentRole);
    if (!role) return false;
    return role.permissions.includes(requiredPermission);
  };

  return hasPermission() ? children : null;
};

export const AuthExample = () => {
  const { t } = useTranslation();
  const [currentRole, setCurrentRole] = useState('admin');
  const [errorMessage, setErrorMessage] = useState('');

  const switchRole = roleId => {
    setCurrentRole(roleId);
    setErrorMessage('');
  };

  const handleUnauthorizedAction = requiredPermission => {
    const role = roles.find(r => r.id === currentRole);
    if (!role || !role.permissions.includes(requiredPermission)) {
      setErrorMessage(
        t('example.auth.error.requiredPermission', {
          permission: permissions.find(p => p.id === requiredPermission)?.name
        })
      );
    }
  };

  const topbarElement = {
    title: t('example.auth.title'),
    right: [
      <div className='flex items-center gap-x-2'>
        <span>{t('example.auth.currentRole')}:</span>
        <Select value={currentRole} onValueChange={switchRole}>
          <SelectTrigger className='w-[120px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role.id} value={role.id}>
                {t(`example.auth.roles.${role.id}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ]
  };

  const topbar = <Topbar {...topbarElement} />;

  return (
    <Page sidebar topbar={topbar}>
      <div className='p-4 space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-normal'>{t('example.auth.heading')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <p>{t('example.auth.description')}</p>

              {errorMessage && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-sm'>
                  <p>{errorMessage}</p>
                </div>
              )}

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='font-medium'>
                      {t('example.auth.permissions.dashboardAccess')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-slate-600 mb-3'>{t('example.auth.allRolesCanAccess')}</p>
                    <Guard requiredPermission='view_dashboard' currentRole={currentRole}>
                      <Button variant='primary' size='sm'>
                        <Icons name='IconLayoutDashboard' className='mr-1' />
                        {t('example.auth.permissions.viewDashboard')}
                      </Button>
                    </Guard>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='font-medium'>
                      {t('example.auth.permissions.projectManagement')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-slate-600 mb-3'>
                      {t('example.auth.adminAndManagerCanManage')}
                    </p>
                    <div className='space-x-2'>
                      <Guard requiredPermission='create_project' currentRole={currentRole}>
                        <Button variant='primary' size='sm'>
                          <Icons name='IconPlus' className='mr-1' />
                          {t('example.auth.permissions.createProject')}
                        </Button>
                      </Guard>

                      {!roles
                        .find(r => r.id === currentRole)
                        ?.permissions.includes('create_project') && (
                        <Button
                          variant='primary'
                          size='sm'
                          onClick={() => handleUnauthorizedAction('create_project')}
                        >
                          <Icons name='IconPlus' className='mr-1' />
                          {t('example.auth.permissions.createProject')}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='font-medium'>
                      {t('example.auth.permissions.userManagement')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-slate-600 mb-3'>
                      {t('example.auth.onlyAdminCanManageUsers')}
                    </p>
                    <div className='space-x-2'>
                      <Guard requiredPermission='edit_users' currentRole={currentRole}>
                        <Button variant='primary' size='sm'>
                          <Icons name='IconUserEdit' className='mr-1' />
                          {t('example.auth.permissions.manageUsers')}
                        </Button>
                      </Guard>

                      {!roles
                        .find(r => r.id === currentRole)
                        ?.permissions.includes('edit_users') && (
                        <Button
                          variant='primary'
                          size='sm'
                          onClick={() => handleUnauthorizedAction('edit_users')}
                        >
                          <Icons name='IconUserEdit' className='mr-1' />
                          {t('example.auth.permissions.manageUsers')}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-normal'>
              {t('example.auth.userList.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <Guard requiredPermission='view_users' currentRole={currentRole}>
              <TableView
                visibleControl
                header={[
                  { title: 'ID', accessorKey: 'id', filter: false, icon: 'IconHash' },
                  { title: t('example.i18n.name'), accessorKey: 'name' },
                  { title: 'Email', accessorKey: 'email' },
                  {
                    title: t('example.auth.roles.title'),
                    accessorKey: 'roles',
                    parser: userRoles => {
                      const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];
                      return rolesArray
                        .map((roleId: string) => {
                          const role = roles.find(r => r.id === roleId);
                          return role ? t(`example.auth.roles.${role.id}`) : roleId;
                        })
                        .join(', ');
                    }
                  },
                  {
                    title: t('example.auth.lastLogin'),
                    accessorKey: 'lastLogin',
                    parser: date => (date ? date.toLocaleString() : '-')
                  },
                  {
                    title: t('example.i18n.operations'),
                    accessorKey: 'operation-column',
                    parser: (_, _record) => (
                      <div className='flex space-x-2'>
                        <Guard requiredPermission='edit_users' currentRole={currentRole}>
                          <Button variant='outline-primary' size='sm'>
                            <Icons name='IconPencil' size={14} className='mr-1' />
                            {t('actions.edit')}
                          </Button>
                        </Guard>

                        <Guard requiredPermission='assign_roles' currentRole={currentRole}>
                          <Button variant='outline-secondary' size='sm'>
                            <Icons name='IconUserCheck' size={14} className='mr-1' />
                            {t('example.auth.permissions.assignRoles')}
                          </Button>
                        </Guard>

                        {!roles
                          .find(r => r.id === currentRole)
                          ?.permissions.includes('edit_users') && (
                          <Button
                            variant='outline-primary'
                            size='sm'
                            onClick={() => handleUnauthorizedAction('edit_users')}
                          >
                            <Icons name='IconPencil' size={14} className='mr-1' />
                            {t('actions.edit')}
                          </Button>
                        )}
                      </div>
                    )
                  }
                ]}
                data={users}
              />
            </Guard>

            {!roles.find(r => r.id === currentRole)?.permissions.includes('view_users') && (
              <div className='p-4 text-center'>
                <p>{t('example.auth.userList.noPermission')}</p>
                <Button
                  variant='outline-primary'
                  size='sm'
                  className='mt-2'
                  onClick={() => handleUnauthorizedAction('view_users')}
                >
                  {t('example.auth.userList.tryView')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Guard requiredPermission='manage_roles' currentRole={currentRole}>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-normal'>
                {t('example.auth.roleManagement.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <TableView
                  header={[
                    { title: 'ID', accessorKey: 'id' },
                    { title: t('example.auth.roleManagement.roleName'), accessorKey: 'name' },
                    {
                      title: t('example.auth.roleManagement.roleDescription'),
                      accessorKey: 'description'
                    },
                    {
                      title: t('example.auth.permissionsCount'),
                      accessorKey: 'permissions',
                      parser: permissions => permissions.length
                    },
                    {
                      title: t('example.i18n.operations'),
                      accessorKey: 'operation-column',
                      parser: (_, _record) => (
                        <div className='flex space-x-2'>
                          <Button variant='outline-primary' size='sm'>
                            <Icons name='IconPencil' size={14} className='mr-1' />
                            {t('actions.edit')}
                          </Button>
                          <Button variant='outline-danger' size='sm'>
                            <Icons name='IconTrash' size={14} className='mr-1' />
                            {t('actions.delete')}
                          </Button>
                        </div>
                      )
                    }
                  ]}
                  data={roles}
                />

                <div className='mt-4'>
                  <h3 className='text-lg font-medium mb-2'>
                    {t('example.auth.roleManagement.createRole')}
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>{t('example.auth.roleManagement.roleName')}</Label>
                      <Input
                        type='text'
                        placeholder={t('example.auth.roleManagement.enterRoleName')}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>{t('example.auth.roleManagement.roleDescription')}</Label>
                      <Input
                        type='text'
                        placeholder={t('example.auth.roleManagement.enterRoleDescription')}
                      />
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label>{t('example.auth.roleManagement.permissions')}</Label>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-2 border border-slate-200 rounded-md p-3'>
                        {permissions.map(permission => (
                          <div key={permission.id} className='flex items-center'>
                            <input type='checkbox' id={`perm-${permission.id}`} className='mr-2' />
                            <label htmlFor={`perm-${permission.id}`}>{permission.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <Button variant='primary'>{t('example.auth.roleManagement.createRole')}</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Guard>

        {!roles.find(r => r.id === currentRole)?.permissions.includes('manage_roles') && (
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-normal'>
                {t('example.auth.roleManagement.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='p-4 text-center'>
                <p>{t('example.auth.roleManagement.noPermission')}</p>
                <Button
                  variant='outline-primary'
                  size='sm'
                  className='mt-2'
                  onClick={() => handleUnauthorizedAction('manage_roles')}
                >
                  {t('example.auth.roleManagement.tryAccess')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Page>
  );
};
