import "../components/RouteRecommend/RouteRecommendPage.css"
import useAutoGoalSession from "../hooks/useAutoGoalSession"
import { useEffect, useMemo, useRef, useState } from "react";
import useNaverScript from "../hooks/useNaverScript";

function SemiCircleGauge({ value, target }) {
  const clamped = Math.max(0, Math.min(value / (target || 1), 1))
  const r = 120
  const cx = 150, cy = 170
  const startX = cx - r, startY = cy
  const endX = cx + r, endY = cy
  const d = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`
  const semiLen = Math.PI * r
  const progressOffset = (1 - clamped) * semiLen
  return (
    <svg className="gauge" viewBox="0 0 300 190" aria-hidden="true">
      <path d={d} className="gauge-bg" />
      <path d={d} className="gauge-fg" style={{ strokeDasharray: semiLen, strokeDashoffset: progressOffset }} />
    </svg>
  )
}

export default function RouteRecommendPage({
  clientId = import.meta.env.VITE_NAVERMAP_CLIENT_ID,
  routeId = "sample-1",
}) {
  const scriptReady = useNaverScript({ clientId })
  const mapRef = useRef(null)
  const mapObj = useRef(null)
  const polylineRef = useRef(null)

  const { total: steps, goal } = useAutoGoalSession()
  const target = goal || 0

  const cadence = 100
  const stepLen = 0.8
  const minutes = Math.round((steps || 0) / cadence)
  const km = ((steps || 0) * stepLen / 1000).toFixed(2)
  const kcal = Math.round((steps || 0) * 0.04)

  const [routeCoords, setRouteCoords] = useState([
    [37.58096, 126.92483],
    [37.58155, 126.92532],
    [37.5822, 126.92596],
    [37.58305, 126.92621],
    [37.58402, 126.92646],
  ])

  useEffect(() => {}, [routeId])

  useEffect(() => {
    if (!scriptReady || !mapRef.current) return
    const { naver } = window
    if (!mapObj.current) {
      mapObj.current = new naver.maps.Map(mapRef.current, {
        zoom: 16,
        mapTypeControl: false,
        logoControl: true,
        center: new naver.maps.LatLng(routeCoords[0][0], routeCoords[0][1]),
      })
    }
    const path = routeCoords.map(([lat, lng]) => new window.naver.maps.LatLng(lat, lng))

    if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null }
    polylineRef.current = new window.naver.maps.Polyline({
      map: mapObj.current,
      path,
      strokeColor: "#0E1440",
      strokeOpacity: 0.95,
      strokeWeight: 6,
      endIcon: 0,
    })

    new naver.maps.Marker({
      map: mapObj.current,
      position: path[0],
      icon: {
        content: '<div style="width:18px;height:18px;border-radius:50%;background:#5d78ff;border:3px solid white;box-shadow:0 0 0 2px #5d78ff;"></div>',
        anchor: new naver.maps.Point(9, 9),
      },
    })
    new naver.maps.Marker({
      map: mapObj.current,
      position: path[path.length - 1],
      icon: {
        content: '<div style="width:20px;height:20px;border-radius:50%;background:#b12ad4;border:3px solid white;box-shadow:0 0 0 2px #b12ad4;"></div>',
        anchor: new naver.maps.Point(10, 10),
      },
    })

    const bounds = new window.naver.maps.LatLngBounds(path[0], path[0])
    path.forEach((p) => bounds.extend(p))
    mapObj.current.fitBounds(bounds, { top: 20, right: 20, bottom: 20, left: 20 })
  }, [scriptReady, routeCoords])

  const progress = useMemo(() => {
    if (!target) return 0
    return Math.min(100, Math.round((steps / target) * 100))
  }, [steps, target])

  return (
    <div className="route-page">
      <div className="map-wrap">
        <div ref={mapRef} className="naver-map" aria-label="추천 경로 지도" />
      </div>
      <section className="gauge-wrap">
        <button className="chip chip-left" onClick={() => alert("경로 설명")}>
          <span className="chip-ico" aria-hidden>🗺️</span>
          경로 설명
        </button>
        <button className="chip chip-right" onClick={() => alert("매장 보기")}>
          <span className="chip-ico" aria-hidden>📋</span>
          매장 보기
        </button>
        <SemiCircleGauge value={steps || 0} target={target || 1} />
        <div className="gauge-center">
          <div className="steps">
            <strong>{(steps || 0).toLocaleString()}보</strong>
            <div className="target">/ {(target || 0).toLocaleString()}보</div>
          </div>
          <p className="mini-stats">
            {minutes}분&nbsp;|&nbsp;{km}km&nbsp;|&nbsp;{kcal} kcal
          </p>
        </div>
      </section>
    </div>
  )
}