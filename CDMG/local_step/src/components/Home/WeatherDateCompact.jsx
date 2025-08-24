import { useLocationCtx } from '../../context/LocationContext'
import useWeather from '../../hooks/useWeather'

const fmtDate = (d=new Date()) => {
  const yy = String(d.getFullYear()).slice(-2)
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  return `${yy}.${mm}.${dd}`
}

export default function WeatherDateCompact(){
  const { coords } = useLocationCtx()
  const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY || 'b2548e560b21d386e9c1d05c5af41205'
  const { weather } = useWeather({ coords, minIntervalMs: 10*60*1000, apiKey: API_KEY })
  const right = weather ? `${weather.temp?.toFixed?.(1)}°C ${weather.description}` : '…'
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'8px',fontSize:'0.9rem',opacity:.9}}>
      <span>{fmtDate()}</span>
      <span>{right}</span>
    </div>
  )
}