import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import ReactGA from 'react-ga4';
import Clarity from '@microsoft/clarity';
import Sentry from '@/app/config/sentry.ts';
import router from '@/app/routing';
import './index.css';
import { PopoverGroup } from '@allcll/allcll-ui';

const queryClient = new QueryClient();
const UsingMockServer = import.meta.env.VITE_USE_MOCK === 'true';
const isProduction = process.env.NODE_ENV === 'production';
const isDevServer = import.meta.env.VITE_DEV_SERVER === 'true';

if (isProduction && !isDevServer) {
  Clarity.init(import.meta.env.VITE_CLARITY_PROJECT_ID);

  // Todo: Sentry tree shaking
  Sentry.initialize();
  ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
}

if (!isProduction || !isDevServer) {
  // @ts-ignore
  window.__TANSTACK_QUERY_CLIENT__ = queryClient;
}

// load mock model
if (!isProduction && UsingMockServer) {
  const { server } = await import('@allcll/mock-server');

  server.start().then(() => {
    loadApp();
  });
} else {
  loadApp();
}

function loadApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <PopoverGroup>
          {/*<DndProvider backend={HTML5Backend}>*/}

          <RouterProvider router={router} />
        </PopoverGroup>

        {/*</DndProvider>*/}
      </QueryClientProvider>
    </StrictMode>,
  );

  // index.js
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/serviceWorker.js')
      .then(function (registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(function (error) {
        console.log('Service Worker registration failed:', error);
      });
  }
}
