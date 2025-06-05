import {
  InputField,
  SelectField,
  DateField,
  Textarea,
  Modal,
  useToastMessage
} from '@ncobase/react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { updateEmployee, createEmployee } from '../apis';

export const EmployeeForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  employee?: any;
  onSuccess?: () => void;
}> = ({ isOpen, onClose, employee, onSuccess }) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const isEdit = !!employee?.user_id;

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      user_id: employee?.user_id || '',
      employee_id: employee?.employee_id || '',
      department: employee?.department || '',
      position: employee?.position || '',
      manager_id: employee?.manager_id || '',
      hire_date: employee?.hire_date || '',
      employment_type: employee?.employment_type || 'full_time',
      status: employee?.status || 'active',
      salary: employee?.salary || '',
      work_location: employee?.work_location || '',
      skills: employee?.skills?.join(', ') || '',
      certifications: employee?.certifications?.join(', ') || ''
    }
  });

  const onSubmit = async data => {
    try {
      const payload = {
        ...data,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()) : [],
        certifications: data.certifications ? data.certifications.split(',').map(c => c.trim()) : []
      };

      if (isEdit) {
        await updateEmployee(payload);
      } else {
        await createEmployee(payload);
      }

      toast.success(t('messages.success'), {
        description: isEdit ? t('employee.update_success') : t('employee.create_success')
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('employee.save_failed')
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onCancel={onClose}
      title={isEdit ? t('employee.edit_title') : t('employee.create_title')}
      confirmText={t(isEdit ? 'actions.update' : 'actions.create')}
      onConfirm={handleSubmit(onSubmit)}
      className='max-w-4xl'
    >
      <div className='space-y-6'>
        {/* Basic Information */}
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

        {/* Skills and Certifications */}
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
    </Modal>
  );
};
