import { useEffect, useState } from 'react';

import { Icons } from '@ncobase/react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { Page } from '@/components/layout';
import { useAuthContext } from '@/features/account/context';
import { useLogout } from '@/features/account/service';

export const Logout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthContext();
  const logout = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [logoutComplete, setLogoutComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performLogout = async () => {
      try {
        setIsLoggingOut(true);
        setError(null);

        if (!isAuthenticated) {
          navigate('/login', { replace: true });
          return;
        }

        await logout({
          showToast: false,
          redirectTo: ''
        });

        setLogoutComplete(true);
        setIsLoggingOut(false);

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } catch (err) {
        console.error('Logout failed:', err);
        setError('Logout failed, redirecting to login...');
        setIsLoggingOut(false);

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    performLogout();
  }, [logout, navigate, isAuthenticated, queryClient]);

  const renderContent = () => {
    if (isLoggingOut) {
      return (
        <div className='flex flex-col items-center justify-center space-y-4'>
          <Icons name='IconLoader2' className='w-8 h-8 animate-spin text-primary-600' />
          <h2 className='text-xl font-medium text-gray-900'>Signing out...</h2>
          <p className='text-gray-600'>Please wait while we sign you out securely.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className='flex flex-col items-center justify-center space-y-4'>
          <Icons name='IconAlertCircle' className='w-8 h-8 text-red-500' />
          <h2 className='text-xl font-medium text-gray-900'>Logout Error</h2>
          <p className='text-gray-600'>{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className='px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700'
          >
            Go to Login
          </button>
        </div>
      );
    }

    if (logoutComplete) {
      return (
        <div className='flex flex-col items-center justify-center space-y-4'>
          <Icons name='IconCheck' className='w-8 h-8 text-green-500' />
          <h2 className='text-xl font-medium text-gray-900'>Successfully Signed Out</h2>
          <p className='text-gray-600'>
            You have been securely signed out. Redirecting to login...
          </p>
          <div className='flex items-center space-x-2 text-sm text-gray-500'>
            <Icons name='IconLoader2' className='w-4 h-4 animate-spin' />
            <span>Redirecting...</span>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Page title='Logout' layout={false}>
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='max-w-md w-full bg-white rounded-lg shadow-sm p-8'>{renderContent()}</div>
      </div>
    </Page>
  );
};

// Quick Logout Button
export const QuickLogout = ({
  children,
  className = '',
  confirmMessage = 'Are you sure you want to sign out?'
}: {
  children?: React.ReactNode;
  className?: string;
  confirmMessage?: string;
}) => {
  const logout = useLogout();

  const handleLogout = () => {
    if (window.confirm(confirmMessage)) {
      logout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center space-x-2 text-red-600 hover:text-red-700 ${className}`}
    >
      <Icons name='IconLogout' className='w-4 h-4' />
      {children && <span>{children}</span>}
    </button>
  );
};
