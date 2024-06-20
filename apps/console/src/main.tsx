import '@/helpers/setup';

import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';

import { ThemeProvider } from './themes';

import { setupStyles } from '@/assets/styles';
import { AppDevHint } from '@/components/app_dev_hint';
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
          <AuthProvider>
            <Router />
          </AuthProvider>
          <AppDevHint />
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
