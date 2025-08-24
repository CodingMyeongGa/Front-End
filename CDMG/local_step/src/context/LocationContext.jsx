import { createContext, useContext, useMemo } from 'react'
import useGeolocation from '../hooks/useGeolocation'

const LocationCtx = createContext(null)

export function LocationProvider({ children }) {
    const { coords, hasPermission, error } = useGeolocation({
        highAccuracy: true,
        currentTimeout: 5000,
        watchTimeout: 10000,
        maximumAgeMs: 2000,
        fallback: { lat: 37.5665, lon: 126.9780 }, // 서울
    })
    const value = useMemo(() => ({ coords, hasPermission, error }), [coords, hasPermission, error])
    return (
        <LocationCtx.Provider value={value}>{children}</LocationCtx.Provider>
    )
}

export function useLocationCtx() {
    return useContext(LocationCtx)
}