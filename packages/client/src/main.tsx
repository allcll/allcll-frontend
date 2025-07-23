import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactGA from 'react-ga4';
import Clarity from '@microsoft/clarity';
import Sentry from '@/utils/3party/sentry';
import router from '@/utils/routing.tsx';
import './index.css';

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

// load mock server
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
        {/*<DndProvider backend={HTML5Backend}>*/}
        <RouterProvider router={router} />
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
