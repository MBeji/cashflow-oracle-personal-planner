import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile.css'
import './utils/iosFixes'
import './utils/chromeiOSFixes'

createRoot(document.getElementById("root")!).render(<App />);
