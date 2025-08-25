import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
// import { AUTH_KEY } from './utils/auth'

// if (import.meta.env.DEV) {
//   try { sessionStorage.removeItem(AUTH_KEY) } catch {}
// }

createRoot(document.getElementById('root')).render(
        <BrowserRouter>
            <App />
        </BrowserRouter>

   
)
