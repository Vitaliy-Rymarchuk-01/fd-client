import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import { ReactQueryProvider } from '@/providers/react-query'

import './index.css'
import App from '@/app/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactQueryProvider>
  </StrictMode>,
)
