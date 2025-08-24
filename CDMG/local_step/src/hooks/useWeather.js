import { useCallback, useEffect, useRef, useState } from 'react'
import WeatherService from '../services/WeatherService'
import { normalizeCityName } from '../utils/string'


export default function useWeather({ coords, minIntervalMs = 10*60*1000, apiKey }){
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const lastFetchRef = useRef(0)
    const timerRef = useRef(null)
    const wasFallbackRef = useRef(false)

    const svcRef = useRef(null)
    if (!svcRef.current) svcRef.current = new WeatherService({ apiKey })

    const fetchOnce = useCallback(async (lat, lon, retries = 2, backoff = 1500) => {
        for (let attempt=0; attempt<=retries; attempt++){
        try{
            setLoading(true); setError(null)
            const data = await svcRef.current.getCurrentWeather(lat, lon)

            const temp = data?.main?.temp
            let description = data?.weather?.[0]?.description || ''
            const map = { '온흐림':'흐림', '튼구름':'구름' }
            if (map[description]) description = map[description]
            const icon = data?.weather?.[0]?.icon

            // ⬇️ 여기에서 city를 계산(정규화)하고 setWeather에 사용
            const cityRaw = data?.name
            const city = normalizeCityName(cityRaw)

            if (typeof temp !== 'number' || !description) throw new Error('DataShapeError')

            setWeather({ temp, description, icon, city })   // ⬅️ 이 위치가 맞다
            lastFetchRef.current = Date.now()
            return
        }catch(e){
            if (attempt < retries){ await new Promise(r=>setTimeout(r, backoff*(attempt+1))); continue }
            setError(e); setWeather(null)
        }finally{ setLoading(false) }
        }
    },[])

    useEffect(() => {
        if (!coords) return
        const isSeoul = Math.abs(coords.lat-37.5665)<1e-6 && Math.abs(coords.lon-126.9780)<1e-6
        if (wasFallbackRef.current && !isSeoul){ wasFallbackRef.current = false; lastFetchRef.current = 0 }
        const now = Date.now()
        if (now - lastFetchRef.current >= minIntervalMs || lastFetchRef.current===0){
        fetchOnce(coords.lat, coords.lon)
        }
    }, [coords?.lat, coords?.lon, minIntervalMs, fetchOnce])

    useEffect(() => {
        if (!coords) return
        clearInterval(timerRef.current)
        timerRef.current = setInterval(() => { fetchOnce(coords.lat, coords.lon) }, minIntervalMs)
        return () => clearInterval(timerRef.current)
    }, [coords?.lat, coords?.lon, minIntervalMs, fetchOnce])

    return { weather, loading, error, refresh: () => coords && fetchOnce(coords.lat, coords.lon) }
}