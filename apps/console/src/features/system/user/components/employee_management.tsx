import { useState, useEffect } from 'react';

import {
  Modal,
  Button,
  InputField,
  SelectField,
  DateField,
  Textarea,
  Badge,
  Icons,
  useToastMessage,
  AlertDialog
} from '@ncobase/react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  useListEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee
} from '../service';

export const EmployeeManagement: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();

  const [filters, setFilters] = useState({
    department: '',
    status: '',
    employment_type: '',
    manager_id: '',
    search: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, employee: null });

  const { data: employeesData, isLoading, refetch } = useListEmployees(filters);
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const handleCreate = () => {
    setEditingEmployee(null);
    reset();
    setShowForm(true);
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    reset(employee);
    setShowForm(true);
  };

  const handleDelete = (employee: any) => {
    setDeleteDialog({ open: true, employee });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.employee) return;

    try {
      await deleteEmployeeMutation.mutateAsync(deleteDialog.employee.user_id);
      toast.success(t('messages.success'), {
        description: t('employee.delete_success')
      });
      setDeleteDialog({ open: false, employee: null });
      refetch();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('employee.delete_failed')
      });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      // Convert skills and certifications from comma-separated strings to arrays
      const payload = {
        ...data,
        skills: data.skills
          ? data.skills
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
          : [],
        certifications: data.certifications
          ? data.certifications
              .split(',')
              .map(c => c.trim())
              .filter(Boolean)
          : []
      };

      if (editingEmployee) {
        await updateEmployeeMutation.mutateAsync({ userId: editingEmployee.user_id, ...payload });
        toast.success(t('messages.success'), {
          description: t('employee.update_success')
        });
      } else {
        await createEmployeeMutation.mutateAsync(payload);
        toast.success(t('messages.success'), {
          description: t('employee.create_success')
        });
      }

      setShowForm(false);
      reset();
      refetch();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('employee.save_failed')
      });
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>{t('employee.management_title')}</h2>
          <p className='text-slate-600'>{t('employee.management_description')}</p>
        </div>
        <Button onClick={handleCreate}>
          <Icons name='IconPlus' className='mr-2' />
          {t('employee.add_employee')}
        </Button>
      </div>

      {/* Filters */}
      <div className='bg-white p-4 rounded-lg border'>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
          <InputField
            placeholder={t('employee.search_placeholder')}
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            prependIcon='IconSearch'
          />

          <SelectField
            placeholder={t('employee.filter_department')}
            value={filters.department}
            onChange={value => setFilters(prev => ({ ...prev, department: value }))}
            options={[
              { label: t('employee.departments.engineering'), value: 'engineering' },
              { label: t('employee.departments.sales'), value: 'sales' },
              { label: t('employee.departments.marketing'), value: 'marketing' },
              { label: t('employee.departments.hr'), value: 'hr' },
              { label: t('employee.departments.finance'), value: 'finance' },
              { label: t('employee.departments.operations'), value: 'operations' }
            ]}
            allowClear
          />

          <SelectField
            placeholder={t('employee.filter_status')}
            value={filters.status}
            onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            options={[
              { label: t('employee.status.active'), value: 'active' },
              { label: t('employee.status.inactive'), value: 'inactive' },
              { label: t('employee.status.terminated'), value: 'terminated' },
              { label: t('employee.status.on_leave'), value: 'on_leave' }
            ]}
            allowClear
          />

          <SelectField
            placeholder={t('employee.filter_employment_type')}
            value={filters.employment_type}
            onChange={value => setFilters(prev => ({ ...prev, employment_type: value }))}
            options={[
              { label: t('employee.employment_types.full_time'), value: 'full_time' },
              { label: t('employee.employment_types.part_time'), value: 'part_time' },
              { label: t('employee.employment_types.contract'), value: 'contract' },
              { label: t('employee.employment_types.intern'), value: 'intern' }
            ]}
            allowClear
          />

          <Button
            variant='outline-slate'
            onClick={() =>
              setFilters({
                department: '',
                status: '',
                employment_type: '',
                manager_id: '',
                search: ''
              })
            }
          >
            {t('actions.clear')}
          </Button>
        </div>
      </div>

      {/* Employee List */}
      <div className='bg-white rounded-lg border'>
        {isLoading ? (
          <div className='p-8 text-center'>
            <Icons name='IconLoader' className='animate-spin mx-auto mb-4' />
            {t('common.loading')}
          </div>
        ) : !employeesData?.items?.length ? (
          <div className='p-8 text-center text-slate-500'>
            <Icons name='IconUsers' className='w-12 h-12 mx-auto mb-4 text-slate-300' />
            {t('employee.no_employees')}
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b bg-slate-50'>
                  <th className='px-4 py-3 text-left font-medium text-slate-900'>
                    {t('employee.fields.user_id')}
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-slate-900'>
                    {t('employee.fields.employee_id')}
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-slate-900'>
                    {t('employee.fields.department')}
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-slate-900'>
                    {t('employee.fields.position')}
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-slate-900'>
                    {t('employee.fields.status')}
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-slate-900'>
                    {t('employee.fields.employment_type')}
                  </th>
                  <th className='px-4 py-3 text-center font-medium text-slate-900'>
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {employeesData.items.map((employee: any) => (
                  <EmployeeRow
                    key={employee.user_id}
                    employee={employee}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    t={t}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Form Modal */}
      <Modal
        isOpen={showForm}
        onCancel={() => {
          setShowForm(false);
          reset();
        }}
        title={editingEmployee ? t('employee.edit_title') : t('employee.create_title')}
        confirmText={editingEmployee ? t('actions.update') : t('actions.create')}
        onConfirm={handleSubmit(onSubmit)}
        className='max-w-4xl'
      >
        <EmployeeForm control={control} errors={errors} isEdit={!!editingEmployee} t={t} />
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        title={t('employee.delete_confirm_title')}
        description={t('employee.delete_confirm_description')}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !prev.open }))}
        cancelText={t('actions.cancel')}
        confirmText={t('actions.delete')}
        onCancel={() => setDeleteDialog({ open: false, employee: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

const EmployeeRow = ({ employee, onEdit, onDelete, t }: any) => {
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'success',
      inactive: 'warning',
      terminated: 'danger',
      on_leave: 'primary'
    };
    return colors[status] || 'secondary';
  };

  return (
    <tr className='hover:bg-slate-50'>
      <td className='px-4 py-3 font-medium'>{employee.user_id}</td>
      <td className='px-4 py-3'>{employee.employee_id || '-'}</td>
      <td className='px-4 py-3'>{employee.department || '-'}</td>
      <td className='px-4 py-3'>{employee.position || '-'}</td>
      <td className='px-4 py-3'>
        <Badge variant={getStatusColor(employee.status)}>
          {t(`employee.status.${employee.status}`)}
        </Badge>
      </td>
      <td className='px-4 py-3'>
        {employee.employment_type
          ? t(`employee.employment_types.${employee.employment_type}`)
          : '-'}
      </td>
      <td className='px-4 py-3'>
        <div className='flex items-center justify-center space-x-2'>
          <Button variant='outline-primary' size='xs' onClick={() => onEdit(employee)}>
            <Icons name='IconPencil' size={14} />
          </Button>
          <Button variant='outline-danger' size='xs' onClick={() => onDelete(employee)}>
            <Icons name='IconTrash' size={14} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

const EmployeeForm = ({ control, errors, isEdit, t }: any) => (
  <div className='space-y-6'>
    <div className='grid grid-cols-2 gap-4'>
      <Controller
        name='user_id'
        control={control}
        rules={{ required: t('forms.input_required') }}
        render={({ field }) => (
          <InputField
            label={t('employee.fields.user_id')}
            placeholder={t('employee.placeholders.user_id')}
            error={errors.user_id?.message}
            disabled={isEdit}
            {...field}
          />
        )}
      />

      <Controller
        name='employee_id'
        control={control}
        render={({ field }) => (
          <InputField
            label={t('employee.fields.employee_id')}
            placeholder={t('employee.placeholders.employee_id')}
            {...field}
          />
        )}
      />

      <Controller
        name='department'
        control={control}
        render={({ field }) => (
          <SelectField
            label={t('employee.fields.department')}
            options={[
              { label: t('employee.departments.engineering'), value: 'engineering' },
              { label: t('employee.departments.sales'), value: 'sales' },
              { label: t('employee.departments.marketing'), value: 'marketing' },
              { label: t('employee.departments.hr'), value: 'hr' },
              { label: t('employee.departments.finance'), value: 'finance' },
              { label: t('employee.departments.operations'), value: 'operations' }
            ]}
            {...field}
          />
        )}
      />

      <Controller
        name='position'
        control={control}
        render={({ field }) => (
          <InputField
            label={t('employee.fields.position')}
            placeholder={t('employee.placeholders.position')}
            {...field}
          />
        )}
      />

      <Controller
        name='manager_id'
        control={control}
        render={({ field }) => (
          <InputField
            label={t('employee.fields.manager_id')}
            placeholder={t('employee.placeholders.manager_id')}
            {...field}
          />
        )}
      />

      <Controller
        name='hire_date'
        control={control}
        render={({ field }) => <DateField label={t('employee.fields.hire_date')} {...field} />}
      />

      <Controller
        name='employment_type'
        control={control}
        render={({ field }) => (
          <SelectField
            label={t('employee.fields.employment_type')}
            options={[
              { label: t('employee.employment_types.full_time'), value: 'full_time' },
              { label: t('employee.employment_types.part_time'), value: 'part_time' },
              { label: t('employee.employment_types.contract'), value: 'contract' },
              { label: t('employee.employment_types.intern'), value: 'intern' }
            ]}
            {...field}
          />
        )}
      />

      <Controller
        name='status'
        control={control}
        render={({ field }) => (
          <SelectField
            label={t('employee.fields.status')}
            options={[
              { label: t('employee.status.active'), value: 'active' },
              { label: t('employee.status.inactive'), value: 'inactive' },
              { label: t('employee.status.terminated'), value: 'terminated' },
              { label: t('employee.status.on_leave'), value: 'on_leave' }
            ]}
            {...field}
          />
        )}
      />

      <Controller
        name='salary'
        control={control}
        render={({ field }) => (
          <InputField
            type='number'
            label={t('employee.fields.salary')}
            placeholder={t('employee.placeholders.salary')}
            {...field}
          />
        )}
      />

      <Controller
        name='work_location'
        control={control}
        render={({ field }) => (
          <SelectField
            label={t('employee.fields.work_location')}
            options={[
              { label: t('employee.locations.office'), value: 'office' },
              { label: t('employee.locations.remote'), value: 'remote' },
              { label: t('employee.locations.hybrid'), value: 'hybrid' }
            ]}
            {...field}
          />
        )}
      />
    </div>

    <div className='space-y-4'>
      <Controller
        name='skills'
        control={control}
        render={({ field }) => (
          <Textarea
            value={t('employee.fields.skills')}
            placeholder={t('employee.placeholders.skills')}
            title={t('employee.hints.skills')}
            rows={3}
            {...field}
          />
        )}
      />

      <Controller
        name='certifications'
        control={control}
        render={({ field }) => (
          <Textarea
            value={t('employee.fields.certifications')}
            placeholder={t('employee.placeholders.certifications')}
            title={t('employee.hints.certifications')}
            rows={3}
            {...field}
          />
        )}
      />
    </div>
  </div>
);
