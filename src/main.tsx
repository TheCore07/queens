import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import './i18n'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Analytics/>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
