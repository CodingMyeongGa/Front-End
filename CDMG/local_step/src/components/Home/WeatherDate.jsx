import React, { useState, useEffect } from 'react';
import './WeatherDate.css';

//문제점
//아이콘을 api가 제공해주는 것으로 사용할 것이냐?
//백엔드에서 정보를 받아야 보안상 안전한데 어떻게 할 것인가?

export default function WeatherDate() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);

    const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY || 'b2548e560b21d386e9c1d05c5af41205';
    // 날짜 출력
    const getFormattedDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
        const day = weekDays[today.getDay()];
        return `${year}년 ${month}월 ${date}일 (${day})`;
    };

    // 날씨 출력
    useEffect(() => {
    const LAT = '37.5665';  // 서울 위도
    const LON = '126.9780'; // 서울 경도
    let cancelled = false;

    // ⏱️ fetch 타임아웃 래퍼
    async function fetchWithTimeout(url, { timeoutMs = 8000 } = {}) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort('timeout'), timeoutMs);
      try {
        const res = await fetch(url, { signal: controller.signal });
        return res;
      } finally {
        clearTimeout(id);
      }
    }

    // 🔁 재시도 + 에러 라벨링
    async function loadWeatherWithRetry(retries = 2, delayMs = 1500) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=kr`;

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          if (cancelled) return;
          setLoading(true);
          setError(null);

          // 키 마스킹해서 로깅
          console.log(
            `[weather] attempt ${attempt + 1}/${retries + 1}`,
            url.replace(API_KEY, '***')
          );

          const res = await fetchWithTimeout(url, { timeoutMs: 8000 });

          // HTTP 에러 분기
          if (!res.ok) {
            const text = await res.text().catch(() => '');
            let payload; try { payload = JSON.parse(text); } catch { payload = { raw: text }; }
            throw { name: 'HTTPError', status: res.status, statusText: res.statusText, payload };
          }

          const data = await res.json();
          console.log('[weather] success payload:', data);

            const temp = data?.main?.temp;
            let description = data?.weather?.[0]?.description || '';
            const descMap = {
            '온흐림': '흐림',
            '튼구름': '구름'
            // '온비': '비',  // 필요하면 추가
            };
            if (descMap[description]) {
            description = descMap[description];
            }
            const icon = data?.weather?.[0]?.icon;
            const city = data?.name;

          // 스키마 방어
          if (typeof temp !== 'number' || !description) {
            throw { name: 'DataShapeError', detail: { temp, description } };
          }

          if (!cancelled) setWeather({ temp, description, icon, city });
          return; // 성공 시 종료
        } catch (e) {
          // 타임아웃/사용자 abort 구분
          if (e?.name === 'AbortError') {
            console.warn('[weather] request aborted:', e);
            if (!cancelled) setError({ type: 'ABORT', message: String(e?.message || e) });
            return; // 더 재시도하지 않음(명시적 abort)
          }

          console.error('[weather] failure:', e);

          // 재시도 조건
          if (attempt < retries) {
            await new Promise(r => setTimeout(r, delayMs * (attempt + 1))); // 백오프
            continue;
          }

          // 최종 실패
          if (!cancelled) {
            setError({ type: e?.name || 'NETWORK', detail: e, online: navigator.onLine });
            setWeather(null);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
    }

    loadWeatherWithRetry();

    // 언마운트 처리
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="weatherdate">
      <section className="date-box" aria-label="오늘 날짜">
        <div className="date-text">{getFormattedDate()}</div>
      </section>


      <section className="weather-box" aria-label="현재 날씨">
        {loading && <div className="loading">날씨 불러오는 중…</div>}

        {!loading && error && (
          <div className="error">
            날씨 정보를 가져올 수 없습니다.
            <details style={{ textAlign: 'left', marginTop: 8 }}>
              <summary>기술정보 보기</summary>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
            <div style={{ marginTop: 8 }}>온라인 상태: {String(navigator.onLine)}</div>
            <button onClick={() => location.reload()} style={{ marginTop: 8 }}>
              다시 시도
            </button>
          </div>
        )}

        {!loading && weather && (
          <div className="weather-content">
          {weather.city && <div className="city">{weather.city}</div>}
          <span className="city-line">|</span>
          <div className="weather-info">
              <div className="temp-desc">
                  <span>기온: </span>
                  <div className="temp">{weather.temp?.toFixed?.(1)}°C</div>
              </div>
              <div className="icon-desc">
                  <span>날씨: </span>
                  {weather.icon && (
                      <img
                          className="icon"
                          alt="weather icon"
                          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                      />
                  )}
                  <div className="desc">{weather.description}</div>
              </div>
          </div>
      </div>
        )}
      </section>
    </div>
  );
}