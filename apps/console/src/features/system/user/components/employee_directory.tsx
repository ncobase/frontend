import { useState, useEffect } from 'react';

import { InputField, SelectField, Button, Icons, Badge, Modal } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { getEmployees } from '../apis';

export const EmployeeDirectory: React.FC = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    employment_type: '',
    manager_id: '',
    search: ''
  });

  useEffect(() => {
    loadEmployees();
  }, [filters]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees(filters);
      setEmployees(data.items || []);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Filters */}
      <div className='bg-slate-50 p-4 rounded-lg'>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
          <InputField
            placeholder={t('employee.filters.search_placeholder')}
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            prependIcon='IconSearch'
          />

          <SelectField
            placeholder={t('employee.filters.department')}
            value={filters.department}
            onChange={value => setFilters(prev => ({ ...prev, department: value }))}
            options={[
              { label: t('employee.departments.engineering'), value: 'engineering' },
              { label: t('employee.departments.sales'), value: 'sales' },
              { label: t('employee.departments.marketing'), value: 'marketing' },
              { label: t('employee.departments.hr'), value: 'hr' },
              { label: t('employee.departments.finance'), value: 'finance' }
            ]}
            allowClear
          />

          <SelectField
            placeholder={t('employee.filters.status')}
            value={filters.status}
            onChange={value => setFilters(prev => ({ ...prev, status: value }))}
            options={[
              { label: t('employee.status.active'), value: 'active' },
              { label: t('employee.status.inactive'), value: 'inactive' },
              { label: t('employee.status.terminated'), value: 'terminated' }
            ]}
            allowClear
          />

          <SelectField
            placeholder={t('employee.filters.employment_type')}
            value={filters.employment_type}
            onChange={value => setFilters(prev => ({ ...prev, employment_type: value }))}
            options={[
              { label: t('employee.employment_types.full_time'), value: 'full_time' },
              { label: t('employee.employment_types.part_time'), value: 'part_time' },
              { label: t('employee.employment_types.contract'), value: 'contract' }
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

      {/* Employee Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <EmployeeCardSkeleton key={index} />)
        ) : employees.length === 0 ? (
          <div className='col-span-full text-center py-8 text-slate-500'>
            {t('employee.no_employees')}
          </div>
        ) : (
          employees.map(employee => (
            <EmployeeCard key={employee.user_id} employee={employee} t={t} />
          ))
        )}
      </div>
    </div>
  );
};

const EmployeeCard = ({ employee, t }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = status => {
    const colors = {
      active: 'success',
      inactive: 'warning',
      terminated: 'danger',
      on_leave: 'primary'
    };
    return colors[status] || 'secondary';
  };

  return (
    <>
      <div className='bg-white border rounded-lg p-4 hover:shadow-md transition-shadow'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center'>
              <Icons name='IconUser' className='w-5 h-5 text-slate-500' />
            </div>
            <div>
              <div className='font-medium'>{employee.user_id}</div>
              <div className='text-sm text-slate-600'>{employee.employee_id}</div>
            </div>
          </div>
          <Badge variant={getStatusColor(employee.status)} size='xs'>
            {t(`employee.status.${employee.status}`)}
          </Badge>
        </div>

        <div className='space-y-2 text-sm'>
          <div className='flex items-center space-x-2'>
            <Icons name='IconBriefcase' className='w-4 h-4 text-slate-400' />
            <span>{employee.position}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <Icons name='IconBuilding' className='w-4 h-4 text-slate-400' />
            <span>{employee.department}</span>
          </div>
          {employee.manager_id && (
            <div className='flex items-center space-x-2'>
              <Icons name='IconUserCheck' className='w-4 h-4 text-slate-400' />
              <span>{employee.manager_id}</span>
            </div>
          )}
          <div className='flex items-center space-x-2'>
            <Icons name='IconMapPin' className='w-4 h-4 text-slate-400' />
            <span>{t(`employee.locations.${employee.work_location}`)}</span>
          </div>
        </div>

        <div className='mt-4 flex justify-between items-center'>
          <Button variant='outline-primary' size='sm' onClick={() => setShowDetails(true)}>
            {t('employee.view_details')}
          </Button>
          <div className='text-xs text-slate-500'>
            {employee.employment_type && t(`employee.employment_types.${employee.employment_type}`)}
          </div>
        </div>
      </div>

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        employee={employee}
      />
    </>
  );
};

const EmployeeCardSkeleton = () => (
  <div className='bg-white border rounded-lg p-4'>
    <div className='animate-pulse'>
      <div className='flex items-center space-x-3 mb-3'>
        <div className='w-10 h-10 bg-slate-200 rounded-full'></div>
        <div className='space-y-2'>
          <div className='h-4 bg-slate-200 rounded w-24'></div>
          <div className='h-3 bg-slate-200 rounded w-16'></div>
        </div>
      </div>
      <div className='space-y-2'>
        <div className='h-3 bg-slate-200 rounded w-32'></div>
        <div className='h-3 bg-slate-200 rounded w-28'></div>
        <div className='h-3 bg-slate-200 rounded w-24'></div>
      </div>
      <div className='mt-4 h-8 bg-slate-200 rounded'></div>
    </div>
  </div>
);

const EmployeeDetailsModal = ({ isOpen, onClose, employee }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onCancel={onClose}
      title={t('employee.details_title')}
      className='max-w-2xl'
    >
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center space-x-4 p-4 bg-slate-50 rounded-lg'>
          <div className='w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center'>
            <Icons name='IconUser' className='w-8 h-8 text-slate-500' />
          </div>
          <div>
            <h3 className='text-lg font-medium'>{employee.user_id}</h3>
            <p className='text-slate-600'>{employee.position}</p>
            <div className='flex items-center space-x-2 mt-1'>
              <Badge variant='outline-primary' size='xs'>
                {employee.employee_id}
              </Badge>
              <Badge variant='outline-slate' size='xs'>
                {employee.department}
              </Badge>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium text-slate-500'>
              {t('employee.fields.department')}
            </label>
            <p className='mt-1'>{employee.department}</p>
          </div>
          <div>
            <label className='text-sm font-medium text-slate-500'>
              {t('employee.fields.employment_type')}
            </label>
            <p className='mt-1'>{t(`employee.employment_types.${employee.employment_type}`)}</p>
          </div>
          <div>
            <label className='text-sm font-medium text-slate-500'>
              {t('employee.fields.work_location')}
            </label>
            <p className='mt-1'>{t(`employee.locations.${employee.work_location}`)}</p>
          </div>
          <div>
            <label className='text-sm font-medium text-slate-500'>
              {t('employee.fields.hire_date')}
            </label>
            <p className='mt-1'>{employee.hire_date || '-'}</p>
          </div>
          {employee.manager_id && (
            <div>
              <label className='text-sm font-medium text-slate-500'>
                {t('employee.fields.manager_id')}
              </label>
              <p className='mt-1'>{employee.manager_id}</p>
            </div>
          )}
          <div>
            <label className='text-sm font-medium text-slate-500'>
              {t('employee.fields.status')}
            </label>
            <p className='mt-1'>
              <Badge variant={getStatusColor(employee.status)}>
                {t(`employee.status.${employee.status}`)}
              </Badge>
            </p>
          </div>
        </div>

        {/* Skills */}
        {employee.skills && employee.skills.length > 0 && (
          <div>
            <label className='text-sm font-medium text-slate-500'>
              {t('employee.fields.skills')}
            </label>
            <div className='mt-2 flex flex-wrap gap-2'>
              {employee.skills.map((skill, index) => (
                <Badge key={index} variant='outline-primary' size='sm'>
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {employee.certifications && employee.certifications.length > 0 && (
          <div>
            <label className='text-sm font-medium text-slate-500'>
              {t('employee.fields.certifications')}
            </label>
            <div className='mt-2 flex flex-wrap gap-2'>
              {employee.certifications.map((cert, index) => (
                <Badge key={index} variant='outline-success' size='sm'>
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

const getStatusColor = status => {
  const colors = {
    active: 'success',
    inactive: 'warning',
    terminated: 'danger',
    on_leave: 'primary'
  };
  return colors[status] || 'secondary';
};
