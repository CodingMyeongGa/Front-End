import "../components/RouteRecommend/RouteRecommendPage.css"
import { useEffect, useMemo, useRef, useState } from "react";


const clientID = "http://localhost:5173/";
/** 네이버 지도 스크립트 로더 */
function useNaverScript(clientId) {
  const [ready, setReady] = useState(!!window.naver?.maps);
  useEffect(() => {
    if (ready) return;
    if (document.getElementById("naver-map-script")) {
      const s = document.getElementById("naver-map-script");
      s.addEventListener("load", () => setReady(true));
      return;
    }
    const el = document.createElement("script");
    el.id = "naver-map-script";
    el.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    el.async = true;
    el.onload = () => setReady(true);
    document.body.appendChild(el);
  }, [clientId, ready]);
  return ready;
}

/** 반원형 게이지 (배경 + 진행) */
function SemiCircleGauge({ value, target }) {
  const clamped = Math.max(0, Math.min(value / target, 1)); // 0~1
  const r = 120;                         // 반지름
  const cx = 150, cy = 170;              // 중심
  const startX = cx - r, startY = cy;
  const endX = cx + r, endY = cy;
  const d = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
  const semiLen = Math.PI * r;           // 반원 길이 = πr
  const progressOffset = (1 - clamped) * semiLen;

  return (
    <svg className="gauge" viewBox="0 0 300 190" aria-hidden="true">
      {/* 배경 */}
      <path d={d} className="gauge-bg" />
      {/* 진행 */}
      <path
        d={d}
        className="gauge-fg"
        style={{ strokeDasharray: semiLen, strokeDashoffset: progressOffset }}
      />
    </svg>
  );
}

/** 메인 페이지 */
export default function RouteRecommendPage({
  clientId = "YOUR_NCP_CLIENT_ID", // 네이버 ncpClientId
  routeId = "sample-1",
}) {
  const scriptReady = useNaverScript(clientId);
  const mapRef = useRef(null);
  const mapObj = useRef(null);
  const polylineRef = useRef(null);

  // ── 데모용 상태 (실서비스에선 백엔드에서 받아와 세팅)
  const [stats, setStats] = useState({
    steps: 4344,
    target: 6000,
    minutes: 42,
    km: 3.48,
    kcal: 110,
  });
  const [routeCoords, setRouteCoords] = useState([
    // [lat, lng] 배열 (샘플)
    [37.58096, 126.92483],
    [37.58155, 126.92532],
    [37.5822, 126.92596],
    [37.58305, 126.92621],
    [37.58402, 126.92646],
  ]);

  // ── 예시: 경로/통계 fetch
  useEffect(() => {
    // (실사용) fetch(`/api/routes/${routeId}`).then(...setRouteCoords)
    // (실사용) fetch(`/api/progress`).then(...setStats)
  }, [routeId]);

  // ── 지도 준비/갱신
  useEffect(() => {
    if (!scriptReady || !mapRef.current) return;
    const { naver } = window;
    if (!mapObj.current) {
      mapObj.current = new naver.maps.Map(mapRef.current, {
        zoom: 16,
        mapTypeControl: false,
        logoControl: true,
        center: new naver.maps.LatLng(routeCoords[0][0], routeCoords[0][1]),
      });
    }
    const path = routeCoords.map(
      ([lat, lng]) => new window.naver.maps.LatLng(lat, lng)
    );

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    polylineRef.current = new window.naver.maps.Polyline({
      map: mapObj.current,
      path,
      strokeColor: "#0E1440", // 남색
      strokeOpacity: 0.95,
      strokeWeight: 6,
      endIcon: 0,
    });

    // 시작/끝 마커(선택)
    new naver.maps.Marker({
      map: mapObj.current,
      position: path[0],
      icon: {
        content:
          '<div style="width:18px;height:18px;border-radius:50%;background:#5d78ff;border:3px solid white;box-shadow:0 0 0 2px #5d78ff;"></div>',
        anchor: new naver.maps.Point(9, 9),
      },
    });
    new naver.maps.Marker({
      map: mapObj.current,
      position: path[path.length - 1],
      icon: {
        content:
          '<div style="width:20px;height:20px;border-radius:50%;background:#b12ad4;border:3px solid white;box-shadow:0 0 0 2px #b12ad4;"></div>',
        anchor: new naver.maps.Point(10, 10),
      },
    });

    // 경로에 맞춰 보기
    const bounds = new window.naver.maps.LatLngBounds(path[0], path[0]);
    path.forEach((p) => bounds.extend(p));
    mapObj.current.fitBounds(bounds, { top: 20, right: 20, bottom: 20, left: 20 });
  }, [scriptReady, routeCoords]);

  const progress = useMemo(
    () => Math.min(100, Math.round((stats.steps / stats.target) * 100)),
    [stats]
  );

  return (
    <div className="route-page">


      {/* 지도 */}
      <div className="map-wrap">
        <div ref={mapRef} className="naver-map" aria-label="추천 경로 지도" />
      </div>

      {/* 게이지 섹션 */}
      <section className="gauge-wrap">
        {/* 좌측/우측 버튼 */}
        <button className="chip chip-left" onClick={() => alert("경로 설명")}>
          <span className="chip-ico" aria-hidden>🗺️</span>
          경로 설명
        </button>
        <button className="chip chip-right" onClick={() => alert("매장 보기")}>
          <span className="chip-ico" aria-hidden>📋</span>
          매장 보기
        </button>

        {/* 반원 게이지 */}
        <SemiCircleGauge value={stats.steps} target={stats.target} />

        {/* 중앙/하단 텍스트 */}
        <div className="gauge-center">
          <div className="steps">
            <strong>{stats.steps.toLocaleString()}보</strong>
            <div className="target">/ {stats.target.toLocaleString()}보</div>
          </div>
          <p className="mini-stats">
            {stats.minutes}분&nbsp;|&nbsp;{stats.km}km&nbsp;|&nbsp;{stats.kcal} kcal
          </p>
        </div>
      </section>

      {/* 중단하기 버튼 */}
      <div className="stop-wrap">
        <button className="btn-stop" onClick={() => alert("중단하기")}>
          중단하기
        </button>
      </div>

    </div>
  );
}
