import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import './index.css'
import App from './App.jsx'
import ChatProvider from './context/ChatProvider.jsx'
import PortfolioLogger from './components/PortfolioLogger.jsx'

// Initialize Google Analytics
// REPLACE 'G-XXXXXXXXXX' WITH YOUR ACTUAL MEASUREMENT ID
if (import.meta.env.PROD) {
  ReactGA.initialize('G-05RX88Q60R');
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
}

const appTree = (
  <ChatProvider>
    <PortfolioLogger />
    <App />
  </ChatProvider>
)

createRoot(document.getElementById('root')).render(
  import.meta.env.PROD ? <StrictMode>{appTree}</StrictMode> : appTree,
)
