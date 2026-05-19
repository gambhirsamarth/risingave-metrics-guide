import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RisingWaveMetricsGuide from '../risingwave-metrics-guide.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RisingWaveMetricsGuide />
  </StrictMode>,
)
