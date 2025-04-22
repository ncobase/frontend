import '@/lib/setup';

import React from 'react';

import { ToastContainer, ToastProvider } from '@ncobase/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';

import { setupStyles } from '@/assets/styles';
import { AppDevHint } from '@/components/app_dev_hint';
import { LoadingIndicator } from '@/components/loading/indicator';
import { ErrorNotification } from '@/components/notifications';
import { ThemeProvider } from '@/components/theme';
import { AuthProvider } from '@/features/account/context';
import { Router } from '@/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 15, // cache for 15 minutes
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

const mount = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <Router />
            </AuthProvider>
            <AppDevHint />
            <LoadingIndicator />
            <ErrorNotification />
            <ToastContainer position='bottom-right' />
          </ToastProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

async function bootstrap() {
  setupStyles();
  mount();
}

bootstrap();
