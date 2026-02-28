import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import { ReactQueryProvider } from '@/providers/react-query'
import { Toaster } from '@/shared/components/ui/sonner'

import './index.css'
import App from '@/app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ReactQueryProvider>
  </StrictMode>,
)
