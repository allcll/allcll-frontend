import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import router from '@/utils/routing.tsx';
import './index.css'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <RouterProvider router={router}/>
      </DndProvider>
    </QueryClientProvider>
  </StrictMode>,
)
