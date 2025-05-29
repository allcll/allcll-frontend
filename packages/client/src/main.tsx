import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { server } from '@allcll/mock-server';
import ReactGA from 'react-ga4';
import Sentry from '@/utils/3party/sentry';
import router from '@/utils/routing.tsx';
import './index.css';

const queryClient = new QueryClient();
const UsingMockServer = import.meta.env.VITE_USE_MOCK === 'true';
const isProduction = process.env.NODE_ENV === 'production';
const isDevServer = import.meta.env.VITE_DEV_SERVER === 'true';

if (isProduction && !isDevServer) {
  import('@/utils/3party/clarity.js' as string).then();

  Sentry.initialize();
  ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
}

// load mock server
if (!isProduction && UsingMockServer) {
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
        <DndProvider backend={HTML5Backend}>
          <RouterProvider router={router} />
        </DndProvider>
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
