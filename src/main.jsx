import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Note: not using StrictMode here because it double-invokes effects
// which messes with GSAP ScrollTrigger initialization
createRoot(document.getElementById('root')).render(<App />)
