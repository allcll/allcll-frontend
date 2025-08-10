import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from '@/utils/routing.tsx';
import '@public/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

const UsingMockServer = import.meta.env.VITE_USE_MOCK === 'true';

if (UsingMockServer) {
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
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
