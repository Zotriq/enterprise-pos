import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import './index.css'
import { installMockApi } from './demo/mockApi.js'

if (import.meta.env.VITE_DEMO === 'true') {
  installMockApi(import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7002/api')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
)
