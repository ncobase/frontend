import { EmployeeManagement } from '../components/employee_management';

import { Page } from '@/components/layout';
import { usePermissions } from '@/features/account/permissions';

export const EmployeesPage = () => {
  const { hasPermission } = usePermissions();
  const canCreate =
    hasPermission('create:employees') ||
    hasPermission('manage:employees') ||
    hasPermission('manage:hr');
  const canUpdate =
    hasPermission('update:employees') ||
    hasPermission('manage:employees') ||
    hasPermission('manage:hr');
  const canDelete = hasPermission('manage:employees') || hasPermission('manage:hr');

  return (
    <Page className='px-4 sm:px-6 lg:px-8 py-8'>
      <EmployeeManagement canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
    </Page>
  );
};

export default EmployeesPage;
