import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import App from './App.jsx'
import './index.css'

// ── Top-level error boundary ──────────────────────────────────────────────────
// Catches any unhandled React render errors so the app never shows a blank screen.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[MediFind] Uncaught render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{ textAlign: 'center', maxWidth: 360 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 24 }}>
              Check the browser console for more detail.
            </p>
            <button
              type="button"
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/' }}
              style={{
                padding: '12px 24px',
                background: '#0d9488',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Service Worker registration ───────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('[SW] Registration failed:', err)
    })
  })
}

// ── App bootstrap ─────────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '14px',
              background:   '#1c1c1e',
              color:        '#fff',
              fontSize:     '15px',
            },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)
