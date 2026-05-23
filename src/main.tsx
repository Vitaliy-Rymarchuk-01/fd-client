import { StrictMode } from 'react'

import { BrowserRouter } from 'react-router'

import { createRoot } from 'react-dom/client'

import App from '@/app/App.tsx'

import { ReactQueryProvider } from '@/providers/react-query'
import { ThemeProvider } from '@/providers/theme-provider'

import { Toaster } from '@/shared/components/ui/sonner'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </ReactQueryProvider>
  </StrictMode>,
)
