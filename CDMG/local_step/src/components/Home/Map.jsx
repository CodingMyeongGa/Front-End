import { useEffect, useRef, useState } from 'react'
import './Map.css'

const CLIENT_ID = import.meta.env.VITE_NAVERMAP_CLIENT_ID
const MAP_SRC = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${CLIENT_ID}&submodules=geocoder`


export default function Map(){
  const boxRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  const [authErr, setAuthErr] = useState(null)

  useEffect(() => {
    let canceled = false
    if (!CLIENT_ID?.trim()) {
        setAuthErr('NO_KEY')
        console.warn('[NAVER MAP] Missing VITE_NAVERMAP_CLIENT_ID. Check .env at project root.')
        return
    }

    console.log('[NAVER MAP] origin:', location.origin, 'clientId:', CLIENT_ID)

    const load = () => new Promise((res, rej) => {
        if (window.naver?.maps) return res()

        // ✅ 항상 openapi 도메인 검사
        let s = document.querySelector(`script[src^="https://openapi.map.naver.com/openapi/v3/maps.js"]`)
        // 환경변수/키가 바뀌었는데 이전 스크립트가 남아있을 수 있음 → 동일 키가 아니면 제거 후 재삽입
        if (s && !s.src.includes(`ncpClientId=${encodeURIComponent(CLIENT_ID)}`)) {
            s.parentNode?.removeChild(s)
            s = null
        }

        // 이전에 잘못된 clientId로 삽입된 스크립트가 있으면 제거 후 다시 삽입
        if (s && !s.src.includes(encodeURIComponent(CLIENT_ID))) {
            s.parentNode?.removeChild(s)
            s = null
        }
        if (!s){
            s = document.createElement('script')
            s.src = MAP_SRC
            s.async = true
            s.defer = true
            document.head.appendChild(s)
        }
        s.addEventListener('load', () => res())
        s.addEventListener('error', () => rej(new Error('naver maps load error')))
    })

    const init = async () => {
        await load()
        if (canceled) return
        if (!window.naver?.maps || typeof window.naver.maps.Map !== 'function') {
            setAuthErr('NAVER_MAPS_AUTH')
            return
        }
        const { maps } = window.naver
        const center = new maps.LatLng(37.5665,126.9780) // fallback: 서울
              const map = new maps.Map(boxRef.current, {
                    center,
                    zoom: 14,
                    zoomControl: true,
                    // ⬇️ 줌 컨트롤을 오른쪽 상단으로 이동 + 슬라이더 제거(+-만 보이게)
                    zoomControlOptions: {
                    position: maps.Position.TOP_RIGHT,
                    style: maps.ZoomControlStyle.SMALL
                    },
              })
        mapRef.current = map

        const put = (lat, lng) => {
                const pos = new maps.LatLng(lat, lng)
                if (!markerRef.current) markerRef.current = new maps.Marker({ position: pos, map })
                else markerRef.current.setPosition(pos)
                map.setCenter(pos)
        }

    if ('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => !canceled && put(coords.latitude, coords.longitude),
            () => !canceled && put(37.5665,126.9780),
            { enableHighAccuracy:true, timeout:10000, maximumAge:0 }
        )
      } else {
            put(37.5665,126.9780)
      }
    }

    init()
    return () => { canceled = true }
  }, [])

    return (
        <div className="map-wrap">
        <div ref={boxRef} className="map-canvas" />
        {authErr && (
            <div style={{position:'absolute',left:8,bottom:8,background:'#fff',padding:'6px 8px',borderRadius:8,fontSize:12}}>
                  {authErr==='NO_KEY'
                    ? '키가 비어있습니다. .env의 VITE_NAVERMAP_CLIENT_ID를 확인하세요.'
                    : '네이버 지도 인증 오류. 콘솔 Network 탭의 maps.js 응답(Referer/Message)을 확인하세요.'}

            </div>
        )}
        </div>
    )
}