import React, { useCallback, useState } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToastMessage,
  Textarea
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { Page, Topbar } from '@/components/layout';
import { useNotificationService } from '@/components/notifications';

export const NotificationExample: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const { addNotification } = useNotificationService();

  // Toast section state
  const [toastMessage, setToastMessage] = useState('This is a sample toast message');
  const [toastDescription, setToastDescription] = useState('This is a more detailed description');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [toastDuration, setToastDuration] = useState('5000');

  // Notification section state
  const [notificationTitle, setNotificationTitle] = useState('This is a sample notification');
  const [notificationDescription, setNotificationDescription] = useState(
    'This notification appears in the header dropdown'
  );
  const [notificationType, setNotificationType] = useState<
    'info' | 'success' | 'warning' | 'error'
  >('info');

  // Handle showing a toast
  const handleShowToast = useCallback(() => {
    const duration = parseInt(toastDuration, 10);

    switch (toastType) {
      case 'success':
        toast.success(toastMessage, {
          description: toastDescription,
          duration
        });
        break;
      case 'error':
        toast.error(toastMessage, {
          description: toastDescription,
          duration
        });
        break;
      case 'warning':
        toast.warning(toastMessage, {
          description: toastDescription,
          duration
        });
        break;
      case 'info':
      default:
        toast.info(toastMessage, {
          description: toastDescription,
          duration
        });
        break;
    }
  }, [toast, toastMessage, toastDescription, toastType, toastDuration]);

  // Handle adding a notification
  const handleAddNotification = useCallback(() => {
    addNotification({
      title: notificationTitle,
      description: notificationDescription,
      type: notificationType
    });

    // Show confirmation toast
    toast.success(t('notification.notification_created'), {
      description: t('notification.check_notification_panel')
    });
  }, [addNotification, toast, notificationTitle, notificationDescription, notificationType, t]);

  // Demo preset toasts
  const showPresetToast = useCallback(
    (preset: string) => {
      switch (preset) {
        case 'loading': {
          const loadingId = toast.info('Loading data...', {
            duration: 0 // Infinite duration
          });

          // Simulate an API call
          setTimeout(() => {
            toast.update(loadingId, {
              message: 'Data loaded successfully',
              type: 'success',
              duration: 3000
            });
          }, 2500);
          break;
        }

        case 'error':
          toast.error('Operation failed', {
            description: 'Could not connect to the server. Please try again later.',
            duration: 5000
          });
          break;

        case 'multi':
          toast.success('First toast');
          setTimeout(() => {
            toast.info('Second toast');
          }, 500);
          setTimeout(() => {
            toast.warning('Third toast');
          }, 1000);
          break;

        case 'form':
          toast.success('Form submitted', {
            description: 'Your form has been successfully submitted and is being processed.',
            duration: 4000
          });
          break;

        case 'clear':
          toast.clear();
          toast.info('All toasts cleared');
          break;
      }
    },
    [toast]
  );

  return (
    <Page title={t('example.notification')} topbar={<Topbar title={t('example.notification')} />}>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 px-4 py-6'>
        {/* Toast Demo Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('example.toast')}</CardTitle>
            <CardDescription>{t('example.toast_description')}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='block font-medium mb-1' htmlFor='toast-message'>
                {t('example.message')}
              </label>
              <Input
                id='toast-message'
                value={toastMessage}
                onChange={e => setToastMessage(e.target.value)}
                placeholder={t('example.enter_message')}
              />
            </div>

            <div>
              <label className='block font-medium mb-1' htmlFor='toast-description'>
                {t('example.description')}
              </label>
              <Textarea
                id='toast-description'
                value={toastDescription}
                onChange={e => setToastDescription(e.target.value)}
                placeholder={t('example.enter_description')}
                rows={2}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block font-medium mb-1' htmlFor='toast-type'>
                  {t('example.type')}
                </label>
                <Select value={toastType} onValueChange={(value: any) => setToastType(value)}>
                  <SelectTrigger id='toast-type'>
                    <SelectValue placeholder={t('example.select_type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='success'>{t('toast.success')}</SelectItem>
                    <SelectItem value='error'>{t('toast.error')}</SelectItem>
                    <SelectItem value='warning'>{t('toast.warning')}</SelectItem>
                    <SelectItem value='info'>{t('toast.info')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='block font-medium mb-1' htmlFor='toast-duration'>
                  {t('example.duration')} (ms)
                </label>
                <Input
                  id='toast-duration'
                  type='number'
                  min='0'
                  step='1000'
                  value={toastDuration}
                  onChange={e => setToastDuration(e.target.value)}
                  placeholder='5000'
                />
              </div>
            </div>

            <div>
              <Button className='w-full' onClick={handleShowToast}>
                {t('example.show_toast')}
              </Button>
            </div>

            <div className='pt-2'>
              <p className='font-medium mb-2'>{t('example.preset_toasts')}</p>
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  variant='outline-primary'
                  size='sm'
                  onClick={() => showPresetToast('loading')}
                >
                  {t('example.loading_toast')}
                </Button>
                <Button
                  variant='outline-primary'
                  size='sm'
                  onClick={() => showPresetToast('error')}
                >
                  {t('example.error_toast')}
                </Button>
                <Button
                  variant='outline-primary'
                  size='sm'
                  onClick={() => showPresetToast('multi')}
                >
                  {t('example.multiple_toasts')}
                </Button>
                <Button variant='outline-primary' size='sm' onClick={() => showPresetToast('form')}>
                  {t('example.form_toast')}
                </Button>
                <Button
                  variant='outline-primary'
                  size='sm'
                  onClick={() => showPresetToast('clear')}
                  className='col-span-2'
                >
                  {t('example.clear_all_toasts')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Demo Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('example.notification')}</CardTitle>
            <CardDescription>{t('example.notification_description')}</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='block font-medium mb-1' htmlFor='notification-title'>
                {t('example.title')}
              </label>
              <Input
                id='notification-title'
                value={notificationTitle}
                onChange={e => setNotificationTitle(e.target.value)}
                placeholder={t('example.enter_title')}
              />
            </div>

            <div>
              <label className='block font-medium mb-1' htmlFor='notification-description'>
                {t('example.description')}
              </label>
              <Textarea
                id='notification-description'
                value={notificationDescription}
                onChange={e => setNotificationDescription(e.target.value)}
                placeholder={t('example.enter_description')}
                rows={2}
              />
            </div>

            <div>
              <label className='block font-medium mb-1' htmlFor='notification-type'>
                {t('example.type')}
              </label>
              <Select
                value={notificationType}
                onValueChange={(value: any) => setNotificationType(value)}
              >
                <SelectTrigger id='notification-type'>
                  <SelectValue placeholder={t('example.select_type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='info'>{t('toast.info')}</SelectItem>
                  <SelectItem value='success'>{t('toast.success')}</SelectItem>
                  <SelectItem value='warning'>{t('toast.warning')}</SelectItem>
                  <SelectItem value='error'>{t('toast.error')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className='w-full' onClick={handleAddNotification}>
              {t('example.add_notification')}
            </Button>
          </CardFooter>
        </Card>

        {/* Documentation and Tips */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>{t('example.notification_system_tips')}</CardTitle>
            <CardDescription>{t('example.notification_system_tips_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h3 className='text-lg font-medium mb-2'>{t('example.toast_usage')}</h3>
                <ul className='list-disc pl-5 space-y-1'>
                  <li>{t('example.toast_tip_1')}</li>
                  <li>{t('example.toast_tip_2')}</li>
                  <li>{t('example.toast_tip_3')}</li>
                  <li>{t('example.toast_tip_4')}</li>
                </ul>

                <div className='mt-4 p-3 bg-slate-50 rounded-md'>
                  <p className='font-mono'>
                    toast.success('Message', &#123; description: 'Description' &#125;);
                    <br />
                    toast.error('Error message');
                    <br />
                    toast.warning('Warning', &#123; duration: 10000 &#125;);
                    <br />
                    toast.info('Info');
                    <br />
                  </p>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-medium mb-2'>{t('example.notification_usage')}</h3>
                <ul className='list-disc pl-5 space-y-1'>
                  <li>{t('example.notification_tip_1')}</li>
                  <li>{t('example.notification_tip_2')}</li>
                  <li>{t('example.notification_tip_3')}</li>
                  <li>{t('example.notification_tip_4')}</li>
                </ul>

                <div className='mt-4 p-3 bg-slate-50 rounded-md'>
                  <p className='font-mono'>
                    addNotification(&#123;
                    <br />
                    &nbsp;&nbsp;title: 'Notification Title',
                    <br />
                    &nbsp;&nbsp;description: 'Notification description',
                    <br />
                    &nbsp;&nbsp;type: 'success'
                    <br />
                    &#125;);
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};
