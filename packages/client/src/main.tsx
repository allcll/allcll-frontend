import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { server } from "@allcll/mock-server";
import router from '@/utils/routing.tsx';
import './index.css'

const queryClient = new QueryClient();
const UsingMockServer = true;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction || !UsingMockServer) {
  loadApp();
}
else {
  // load mock server
  server.start().then(() => {
    loadApp();
  });
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