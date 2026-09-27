import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { PrimeReactProvider } from "primereact/api";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PrimeReactProvider value={{ unstyled: true, pt: {} }}>
        <App />
      </PrimeReactProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
