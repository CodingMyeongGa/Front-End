import { useEffect, useRef, useState } from 'react'

export default function useGeolocation({
    highAccuracy = true,
    currentTimeout = 5000,
    watchTimeout = 10000,
    maximumAgeMs = 2000,
    fallback = { lat: 37.5665, lon: 126.9780 },
} = {}) {
    const [coords, setCoords] = useState(null)
    const [hasPermission, setHasPermission] = useState(null)
    const [error, setError] = useState(null)
    const watchIdRef = useRef(null)

    useEffect(() => {
        let canceled = false
        if (!('geolocation' in navigator)) {
            setCoords(fallback); setHasPermission(false); return
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords:c }) => { if (!canceled){ 
                setCoords({ lat:c.latitude, lon:c.longitude }); setHasPermission(true) 
            } }, (e) => { if (!canceled){ 
                setCoords(fallback); setHasPermission(false); setError(e) 
            } }, { 
                enableHighAccuracy: highAccuracy, timeout: currentTimeout, maximumAge: 0 
            }
        )

        watchIdRef.current = navigator.geolocation.watchPosition(
            ({ coords:c }) => { if (!canceled) setCoords({ 
                lat:c.latitude, lon:c.longitude 
            }) }, (e) => { if (!canceled) setError(e) },
            { enableHighAccuracy: highAccuracy, timeout: watchTimeout, maximumAge: maximumAgeMs }
        )

        return () => {
            canceled = true
            if (watchIdRef.current != null) navigator.geolocation.clearWatch(watchIdRef.current)
        }
    }, [highAccuracy, currentTimeout, watchTimeout, maximumAgeMs, fallback?.lat, fallback?.lon])

    return { coords, hasPermission, error }
}