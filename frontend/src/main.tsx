import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // Add this
import { CartProvider } from './context/CartContext'; // Add this
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider> {/* Provides the cart state to all components */}
      <BrowserRouter> {/* Provides navigation context */}
        <App />
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)