import { useState } from 'react';

import { Button, Container, Icons, Modal, ScrollView, Badge } from '@ncobase/react';
import { formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Session } from '../session';
import { useSessions, useDeleteSession, useDeactivateAllSessions } from '../session.hooks';

import { Page } from '@/components/layout';

const getDeviceIcon = (userAgent?: string, deviceInfo?: Record<string, any>) => {
  const isMobile = deviceInfo?.mobile || userAgent?.toLowerCase().includes('mobile');
  const isTablet = userAgent?.toLowerCase().includes('tablet');

  if (isMobile) return 'IconDeviceMobile';
  if (isTablet) return 'IconDeviceTablet';
  return 'IconDeviceDesktop';
};

const getLocationDisplay = (session: Session) => {
  return session.location || session.ip_address || 'Unknown';
};

const SessionCard = ({
  session,
  isCurrentSession,
  onDelete
}: {
  session: Session;
  isCurrentSession: boolean;
  onDelete: (_id: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className='bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow'>
      <div className='flex items-start justify-between'>
        <div className='flex items-start gap-3'>
          <div className='p-2 bg-gray-100 rounded-lg'>
            <Icons
              name={getDeviceIcon(session.user_agent, session.device_info)}
              className='w-5 h-5 text-gray-600'
            />
          </div>

          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='font-medium text-gray-900'>
                {session.device_info?.browser || 'Unknown Browser'}
              </span>

              {isCurrentSession && (
                <Badge variant='success' size='sm'>
                  {t('sessions.current')}
                </Badge>
              )}

              {!session.is_active && (
                <Badge variant='secondary' size='sm'>
                  {t('sessions.inactive')}
                </Badge>
              )}
            </div>

            <div className='text-sm text-gray-600 space-y-1'>
              <div className='flex items-center gap-1'>
                <Icons name='IconMapPin' className='w-3 h-3' />
                <span>{getLocationDisplay(session)}</span>
              </div>

              <div className='flex items-center gap-1'>
                <Icons name='IconClock' className='w-3 h-3' />
                <span>
                  {session.last_access_at
                    ? formatRelativeTime(new Date(session.last_access_at))
                    : t('sessions.no_activity')}
                </span>
              </div>

              {session.login_method && (
                <div className='flex items-center gap-1'>
                  <Icons name='IconLogin' className='w-3 h-3' />
                  <span>{session.login_method}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isCurrentSession && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => onDelete(session.id)}
            className='text-red-600 hover:text-red-700 hover:border-red-300'
          >
            <Icons name='IconLogout' className='w-4 h-4' />
            {t('sessions.revoke')}
          </Button>
        )}
      </div>
    </div>
  );
};

// Main session page component
export const SessionPage = () => {
  const { t } = useTranslation();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const { data: sessionsData, isLoading, error } = useSessions({ is_active: true });
  const deleteSessionMutation = useDeleteSession();
  const deactivateAllMutation = useDeactivateAllSessions();

  const sessions = sessionsData?.items || [];

  // Find current session (most recent active session)
  const currentSessionId = sessions.find(s => s?.is_active)?.id;

  const handleDeleteSession = (sessionId: string) => {
    deleteSessionMutation.mutate(sessionId);
  };

  const handleDeactivateAll = () => {
    deactivateAllMutation.mutate(undefined, {
      onSuccess: () => setShowDeactivateModal(false)
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Page title={t('sessions.title')}>
        <Container className='max-w-4xl'>
          <div className='flex justify-center items-center py-12'>
            <Icons name='IconLoader2' className='w-6 h-6 animate-spin' />
          </div>
        </Container>
      </Page>
    );
  }

  // Error state
  if (error) {
    return (
      <Page title={t('sessions.title')}>
        <Container className='max-w-4xl'>
          <div className='text-center py-12'>
            <Icons name='IconAlertCircle' className='w-12 h-12 mx-auto text-red-500 mb-4' />
            <p className='text-gray-600'>{t('sessions.load_error')}</p>
          </div>
        </Container>
      </Page>
    );
  }

  return (
    <Page title={t('sessions.title')}>
      <ScrollView className='py-6'>
        <Container className='max-w-4xl'>
          {/* Header */}
          <div className='mb-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-gray-900 mb-2'>{t('sessions.title')}</h1>
                <p className='text-gray-600'>{t('sessions.description')}</p>
              </div>

              {sessions.length > 1 && (
                <Button
                  variant='outline'
                  onClick={() => setShowDeactivateModal(true)}
                  className='text-red-600 hover:text-red-700 hover:border-red-300'
                >
                  <Icons name='IconLogout' className='w-4 h-4 mr-2' />
                  {t('sessions.logout_all')}
                </Button>
              )}
            </div>
          </div>

          {/* Sessions list */}
          <div className='space-y-4'>
            {sessions.length === 0 ? (
              <div className='text-center py-12'>
                <Icons name='IconDevices' className='w-12 h-12 mx-auto text-gray-400 mb-4' />
                <p className='text-gray-600'>{t('sessions.no_sessions')}</p>
              </div>
            ) : (
              sessions.map(session => (
                <SessionCard
                  key={session?.id}
                  session={session}
                  isCurrentSession={session?.id === currentSessionId}
                  onDelete={handleDeleteSession}
                />
              ))
            )}
          </div>

          {/* Deactivate all confirmation modal */}
          <Modal
            isOpen={showDeactivateModal}
            onChange={() => setShowDeactivateModal(!showDeactivateModal)}
            title={t('sessions.logout_all_confirm_title')}
            description={t('sessions.logout_all_confirm_description')}
          >
            <div className='flex justify-end gap-3 mt-6'>
              <Button
                variant='outline'
                onClick={() => setShowDeactivateModal(false)}
                disabled={deactivateAllMutation.isPending}
              >
                {t('actions.cancel')}
              </Button>

              <Button
                variant='default'
                onClick={handleDeactivateAll}
                disabled={deactivateAllMutation.isPending}
                className='bg-red-600 hover:bg-red-700'
              >
                {deactivateAllMutation.isPending && (
                  <Icons name='IconLoader2' className='w-4 h-4 mr-2 animate-spin' />
                )}
                {t('sessions.logout_all')}
              </Button>
            </div>
          </Modal>
        </Container>
      </ScrollView>
    </Page>
  );
};
