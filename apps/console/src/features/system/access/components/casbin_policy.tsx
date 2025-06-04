import { useState, useEffect } from 'react';

import {
  Button,
  InputField,
  SelectField,
  Badge,
  Icons,
  Modal,
  AlertDialog,
  useToastMessage
} from '@ncobase/react';
import { useForm, Controller, Control, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { createCasbinRule, deleteCasbinRule, getCasbinRules, updateCasbinRule } from '../apis';

export const CasbinPolicy: React.FC = () => {
  const { t } = useTranslation();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [activeTab, setActiveTab] = useState('p');

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await getCasbinRules();
      setPolicies(data.items || []);
    } catch (error) {
      console.error('Failed to load policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = () => {
    setEditingPolicy(null);
    setShowPolicyForm(true);
  };

  const handleEditPolicy = policy => {
    setEditingPolicy(policy);
    setShowPolicyForm(true);
  };

  const filteredPolicies = policies.filter(policy => policy.p_type === activeTab);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold'>{t('casbin.title')}</h2>
          <p className='text-slate-600 text-sm'>{t('casbin.description')}</p>
        </div>
        <Button onClick={handleCreatePolicy}>
          <Icons name='IconPlus' className='mr-2' />
          {t('casbin.create_policy')}
        </Button>
      </div>

      {/* Policy Types Tabs */}
      <div className='bg-white border border-slate-200/60 rounded-lg'>
        <div className='border-b border-slate-200/60 p-4'>
          <div className='flex space-x-4'>
            <Button
              variant={activeTab === 'p' ? 'outline-primary' : 'outline-slate'}
              size='sm'
              onClick={() => setActiveTab('p')}
            >
              {t('casbin.policy_types.p')} (Policies)
            </Button>
            <Button
              variant={activeTab === 'g' ? 'outline-primary' : 'outline-slate'}
              size='sm'
              onClick={() => setActiveTab('g')}
            >
              {t('casbin.policy_types.g')} (Role Inheritance)
            </Button>
            <Button
              variant={activeTab === 'g2' ? 'outline-primary' : 'outline-slate'}
              size='sm'
              onClick={() => setActiveTab('g2')}
            >
              {t('casbin.policy_types.g2')} (Resource Groups)
            </Button>
          </div>
        </div>

        {/* Policies List */}
        <div className='p-4'>
          {loading ? (
            <div className='text-center py-8 text-slate-500'>{t('common.loading')}</div>
          ) : filteredPolicies.length === 0 ? (
            <div className='text-center py-8 text-slate-500'>{t('casbin.no_policies')}</div>
          ) : (
            <div className='space-y-3'>
              {filteredPolicies.map(policy => (
                <CasbinPolicyItem key={policy.id} policy={policy} onEdit={handleEditPolicy} t={t} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Policy Form Modal */}
      <CasbinPolicyForm
        isOpen={showPolicyForm}
        onClose={() => setShowPolicyForm(false)}
        policy={editingPolicy}
        onSuccess={() => {
          setShowPolicyForm(false);
          loadPolicies();
        }}
      />
    </div>
  );
};

const CasbinPolicyItem = ({ policy, onEdit, t }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const toast = useToastMessage();

  const handleDelete = async () => {
    try {
      await deleteCasbinRule(policy.id);
      toast.success(t('messages.success'), {
        description: t('casbin.delete_success')
      });
      // Refresh policies
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('casbin.delete_failed')
      });
    }
    setShowDeleteDialog(false);
  };

  const getPolicyColor = ptype => {
    const colors = {
      p: 'bg-blue-100 text-blue-800',
      g: 'bg-green-100 text-green-800',
      g2: 'bg-purple-100 text-purple-800'
    };
    return colors[ptype] || 'bg-slate-100 text-slate-800';
  };

  return (
    <>
      <div className='flex items-center justify-between p-3 border border-slate-200/60 rounded-lg hover:bg-slate-50'>
        <div className='flex items-center space-x-4'>
          <Badge className={getPolicyColor(policy.p_type)}>{policy.p_type}</Badge>

          <div className='font-mono text-sm'>
            <span className='text-slate-600'>{policy.v0}</span>
            <span className='mx-2 text-slate-400'>→</span>
            <span className='text-slate-800'>{policy.v1}</span>
            <span className='mx-2 text-slate-400'>→</span>
            <span className='text-slate-600'>{policy.v2}</span>
            {policy.v3 && (
              <>
                <span className='mx-2 text-slate-400'>→</span>
                <span className='text-slate-500'>{policy.v3}</span>
              </>
            )}
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <Button variant='outline-slate' size='xs' onClick={() => onEdit(policy)}>
            <Icons name='IconPencil' size={14} />
          </Button>
          <Button variant='outline-danger' size='xs' onClick={() => setShowDeleteDialog(true)}>
            <Icons name='IconTrash' size={14} />
          </Button>
        </div>
      </div>

      <AlertDialog
        title={t('casbin.delete_confirm_title')}
        description={t('casbin.delete_confirm_description')}
        isOpen={showDeleteDialog}
        onChange={() => setShowDeleteDialog(!showDeleteDialog)}
        cancelText={t('actions.cancel')}
        confirmText={t('actions.delete')}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

const CasbinPolicyForm = ({ isOpen, onClose, policy, onSuccess }) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const isEdit = !!policy?.id;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      p_type: policy?.p_type || 'p',
      v0: policy?.v0 || '',
      v1: policy?.v1 || '',
      v2: policy?.v2 || '',
      v3: policy?.v3 || '',
      v4: policy?.v4 || '',
      v5: policy?.v5 || ''
    }
  });

  const watchPType = watch('p_type');

  const onSubmit = async data => {
    try {
      if (isEdit) {
        await updateCasbinRule({ id: policy.id, ...data });
      } else {
        await createCasbinRule(data);
      }

      toast.success(t('messages.success'), {
        description: isEdit ? t('casbin.update_success') : t('casbin.create_success')
      });

      onSuccess();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('casbin.save_failed')
      });
    }
  };

  const getPolicyFieldLabels = ptype => {
    switch (ptype) {
      case 'p':
        return {
          v0: t('casbin.fields.subject'),
          v1: t('casbin.fields.object'),
          v2: t('casbin.fields.action'),
          v3: t('casbin.fields.effect'),
          v4: t('casbin.fields.condition'),
          v5: t('casbin.fields.extra')
        };
      case 'g':
        return {
          v0: t('casbin.fields.user'),
          v1: t('casbin.fields.role'),
          v2: t('casbin.fields.domain'),
          v3: '',
          v4: '',
          v5: ''
        };
      case 'g2':
        return {
          v0: t('casbin.fields.resource'),
          v1: t('casbin.fields.group'),
          v2: t('casbin.fields.domain'),
          v3: '',
          v4: '',
          v5: ''
        };
      default:
        return {
          v0: 'V0',
          v1: 'V1',
          v2: 'V2',
          v3: 'V3',
          v4: 'V4',
          v5: 'V5'
        };
    }
  };

  const fieldLabels = getPolicyFieldLabels(watchPType);
  const requiredFields = watchPType === 'p' ? ['v0', 'v1', 'v2'] : ['v0', 'v1'];

  return (
    <Modal
      isOpen={isOpen}
      onCancel={onClose}
      title={isEdit ? t('casbin.edit_policy') : t('casbin.create_policy')}
      confirmText={t(isEdit ? 'actions.update' : 'actions.create')}
      onConfirm={handleSubmit(onSubmit)}
      className='max-w-2xl'
    >
      <div className='space-y-4'>
        <Controller
          name='p_type'
          control={control}
          rules={{ required: t('forms.select_required') }}
          render={({ field }) => (
            <SelectField
              label={t('casbin.fields.policy_type')}
              options={[
                { label: 'p (Policy)', value: 'p' },
                { label: 'g (Role Inheritance)', value: 'g' },
                { label: 'g2 (Resource Groups)', value: 'g2' }
              ]}
              error={errors.p_type?.message}
              {...field}
            />
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
          {Object.entries(fieldLabels).map(([field, label]) => {
            if (!label) return null;

            return (
              <Controller
                key={field}
                name={field}
                control={control as unknown as Control<FieldValues>}
                rules={
                  requiredFields.includes(field) ? { required: t('forms.input_required') } : {}
                }
                render={({ field: fieldProps }) => (
                  <InputField
                    label={label}
                    placeholder={t(`casbin.placeholders.${field}`)}
                    error={errors[field]?.message}
                    {...fieldProps}
                  />
                )}
              />
            );
          })}
        </div>

        {/* Policy Preview */}
        <div className='bg-slate-50 p-3 rounded-lg'>
          <div className='text-sm font-medium mb-2'>{t('casbin.preview')}</div>
          <div className='font-mono text-sm text-slate-700'>
            {watchPType}, {watch('v0')}, {watch('v1')}, {watch('v2')}
            {watch('v3') && `, ${watch('v3')}`}
            {watch('v4') && `, ${watch('v4')}`}
            {watch('v5') && `, ${watch('v5')}`}
          </div>
        </div>
      </div>
    </Modal>
  );
};
