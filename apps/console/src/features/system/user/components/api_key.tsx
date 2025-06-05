import { useState, useEffect } from 'react';

import {
  Button,
  InputField,
  Badge,
  Icons,
  Modal,
  AlertDialog,
  useToastMessage
} from '@ncobase/react';
import { formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { getUserApiKeys, generateApiKey, deleteApiKey } from '../apis';

export const ApiKey: React.FC<{ userId: string }> = ({ userId }) => {
  const { t } = useTranslation();
  const [apiKeys, setApiKey] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState(null);

  useEffect(() => {
    loadApiKey();
  }, [userId]);

  const loadApiKey = async () => {
    try {
      setLoading(true);
      const keys = await getUserApiKeys(userId);
      console.log(keys);

      setApiKey(keys);
    } catch (error) {
      console.error('Failed to load API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    try {
      const newKey = await generateApiKey({ name: newKeyName });
      setGeneratedKey(newKey);
      setNewKeyName('');
      setShowCreateForm(false);
      await loadApiKey();
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='font-medium'>{t('api_keys.title')}</h3>
          <p className='text-sm text-slate-600'>{t('api_keys.description')}</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Icons name='IconPlus' className='mr-2' />
          {t('api_keys.create')}
        </Button>
      </div>

      {/* API Keys List */}
      <div className='space-y-3'>
        {loading ? (
          <div className='text-center py-8 text-slate-500'>{t('common.loading')}</div>
        ) : apiKeys.length === 0 ? (
          <div className='text-center py-8 text-slate-500'>
            <Icons name='IconKey' className='w-12 h-12 mx-auto mb-4 text-slate-300' />
            <p>{t('api_keys.no_keys')}</p>
            <Button
              variant='outline-primary'
              className='mt-4'
              onClick={() => setShowCreateForm(true)}
            >
              {t('api_keys.create_first')}
            </Button>
          </div>
        ) : (
          apiKeys.map(key => <ApiKeyItem key={key.id} apiKey={key} onDelete={loadApiKey} t={t} />)
        )}
      </div>

      {/* Create Form Modal */}
      <Modal
        isOpen={showCreateForm}
        onCancel={() => {
          setShowCreateForm(false);
          setNewKeyName('');
        }}
        title={t('api_keys.create_title')}
        confirmText={t('actions.create')}
        onConfirm={handleCreateKey}
      >
        <div className='space-y-4'>
          <InputField
            label={t('api_keys.fields.name')}
            placeholder={t('api_keys.placeholders.name')}
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            description={t('api_keys.hints.name')}
          />
        </div>
      </Modal>

      {/* Generated Key Modal */}
      <Modal
        isOpen={!!generatedKey}
        onCancel={() => setGeneratedKey(null)}
        title={t('api_keys.generated_title')}
        cancelText={t('actions.close')}
      >
        <div className='space-y-4'>
          <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
            <div className='flex items-start space-x-3'>
              <Icons name='IconAlertTriangle' className='w-5 h-5 text-amber-500 mt-0.5' />
              <div>
                <h4 className='font-medium text-amber-800'>{t('api_keys.security_warning')}</h4>
                <p className='text-sm text-amber-700 mt-1'>{t('api_keys.security_warning_text')}</p>
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>{t('api_keys.fields.key')}</label>
            <div className='flex items-center space-x-2'>
              <InputField value={generatedKey?.key || ''} readOnly className='font-mono text-xs' />
              <Button
                variant='outline-slate'
                size='sm'
                onClick={() => navigator.clipboard.writeText(generatedKey?.key)}
              >
                <Icons name='IconCopy' size={14} />
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const ApiKeyItem = ({ apiKey, onDelete, t }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const toast = useToastMessage();

  const handleDelete = async () => {
    try {
      await deleteApiKey(apiKey.id);
      toast.success(t('messages.success'), {
        description: t('api_keys.delete_success')
      });
      onDelete();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('api_keys.delete_failed')
      });
    }
    setShowDeleteDialog(false);
  };

  const maskKey = key => {
    return key.substring(0, 8) + '•'.repeat(24) + key.substring(key.length - 8);
  };

  return (
    <>
      <div className='border rounded-lg p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <div className='flex items-center space-x-3'>
              <Icons name='IconKey' className='w-5 h-5 text-slate-500' />
              <div>
                <div className='font-medium'>{apiKey.name}</div>
                <div className='text-sm text-slate-600'>
                  {t('api_keys.created')} {formatRelativeTime(new Date(apiKey.created_at))}
                </div>
                {apiKey.last_used && (
                  <div className='text-xs text-slate-500'>
                    {t('api_keys.last_used')}:{' '}
                    {apiKey.created_at != apiKey.last_used
                      ? formatRelativeTime(new Date(apiKey.last_used))
                      : t('api_keys.unused')}
                  </div>
                )}
              </div>
            </div>

            <div className='mt-3 flex items-center space-x-2'>
              <div className='font-mono text-xs bg-slate-100 px-2 py-1 rounded'>
                {showKey ? apiKey.key : maskKey(apiKey.key)}
              </div>
              <Button variant='ghost' size='xs' onClick={() => setShowKey(!showKey)}>
                <Icons name={showKey ? 'IconEyeOff' : 'IconEye'} size={14} />
              </Button>
              <Button
                variant='ghost'
                size='xs'
                onClick={() => navigator.clipboard.writeText(apiKey.key)}
              >
                <Icons name='IconCopy' size={14} />
              </Button>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            {!apiKey.last_used && (
              <Badge variant='warning' size='xs'>
                {t('api_keys.unused')}
              </Badge>
            )}
            <Button variant='outline-danger' size='xs' onClick={() => setShowDeleteDialog(true)}>
              <Icons name='IconTrash' size={14} />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        title={t('api_keys.delete_confirm_title')}
        description={t('api_keys.delete_confirm_description', { name: apiKey.name })}
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
