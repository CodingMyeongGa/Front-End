import { useLocationCtx } from '../../context/LocationContext'
import { useEffect, useRef, useState } from 'react'
import './Map.css'

const CLIENT_ID = import.meta.env.VITE_NAVERMAP_CLIENT_ID
const MAP_SRC = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${CLIENT_ID}&submodules=geocoder`

export default function Map(){
  const { coords } = useLocationCtx()
  const boxRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [authErr, setAuthErr] = useState(null)

  useEffect(() => {
    let canceled = false
    if (!CLIENT_ID?.trim()) { setAuthErr('NO_KEY'); return }

    const load = () => new Promise((res, rej) => {
      if (window.naver?.maps) return res()
      let s = document.querySelector(`script[src^="https://openapi.map.naver.com/openapi/v3/maps.js"]`)
      if (s && !s.src.includes(`ncpClientId=${encodeURIComponent(CLIENT_ID)}`)) { s.parentNode?.removeChild(s); s = null }
      if (!s){ s = document.createElement('script'); s.src = MAP_SRC; s.async = true; s.defer = true; document.head.appendChild(s) }
      s.addEventListener('load', () => res())
      s.addEventListener('error', () => rej(new Error('naver maps load error')))
    })

    const init = async () => {
      await load()
      if (canceled) return
      if (!window.naver?.maps || typeof window.naver.maps.Map !== 'function') { setAuthErr('NAVER_MAPS_AUTH'); return }
      const { maps } = window.naver
      const center = new maps.LatLng(37.5665,126.9780)
      const map = new maps.Map(boxRef.current, {
        center, zoom: 17, zoomControl: true,
        zoomControlOptions: { position: maps.Position.TOP_RIGHT, style: maps.ZoomControlStyle.SMALL },
      })
      mapRef.current = map
    }
    init()
    return () => { canceled = true }
  }, [])

  useEffect(() => {
    if (!coords || !window.naver?.maps || !mapRef.current) return
    const { maps } = window.naver
    const pos = new maps.LatLng(coords.lat, coords.lon)
    if (!markerRef.current) markerRef.current = new maps.Marker({ position: pos, map: mapRef.current })
    else markerRef.current.setPosition(pos)
    mapRef.current.setCenter(pos)
  }, [coords?.lat, coords?.lon])

  return (
    <div className="map-wrap">
      <div ref={boxRef} className="map-canvas" />
      {authErr && (
        <div style={{position:'absolute',left:8,bottom:8,background:'#fff',padding:'6px 8px',borderRadius:8,fontSize:12}}>
          {authErr==='NO_KEY' ? '키가 비어있습니다. .env의 VITE_NAVERMAP_CLIENT_ID를 확인하세요.' : '네이버 지도 인증 오류. 콘솔 Network 탭 확인'}
        </div>
      )}
    </div>
  )
}