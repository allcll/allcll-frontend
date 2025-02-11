import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactGA from "react-ga4";
import * as Sentry from "@sentry/react";
import { server } from "@allcll/mock-server";
import router from '@/utils/routing.tsx';
import './index.css'

const queryClient = new QueryClient();
const UsingMockServer = true;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  Sentry.init({
    dsn: "https://e9f254e66aacba9bfb5a6901063e0009@o4508692782907392.ingest.us.sentry.io/4508782708326400",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: [/^https:\/\/www.allcll\.kr/, /^https:\/\/allcll\.kr/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });

  ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);
}

// load mock server
if (!isProduction && UsingMockServer) {
  server.start().then(() => {
    loadApp();
  });
}
else {
  loadApp();
}


function loadApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={HTML5Backend}>
          <RouterProvider router={router}/>
        </DndProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}