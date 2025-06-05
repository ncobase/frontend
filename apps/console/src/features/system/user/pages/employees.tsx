import { useState } from 'react';

import { EmployeeDirectory, EmployeeForm } from '../components';

export const EmployeesPage = () => {
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  return (
    <>
      <EmployeeDirectory
        onCreateEmployee={() => {
          setEditingEmployee(null);
          setShowEmployeeForm(true);
        }}
        onEditEmployee={employee => {
          setEditingEmployee(employee);
          setShowEmployeeForm(true);
        }}
      />

      <EmployeeForm
        isOpen={showEmployeeForm}
        onClose={() => setShowEmployeeForm(false)}
        employee={editingEmployee}
        onSuccess={() => {
          setShowEmployeeForm(false);
          // Refresh employee list
        }}
      />
    </>
  );
};

export default EmployeesPage;
