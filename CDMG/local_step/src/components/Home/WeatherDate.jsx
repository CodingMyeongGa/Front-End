import React from 'react';
import './WeatherDate.css';
import { getFormattedDate } from '../../utils/date';
import { useLocationCtx } from '../../context/LocationContext';
import useWeather from '../../hooks/useWeather';

export default function WeatherDate({ onWeekMeta }) {
  React.useEffect(() => {
    const jsDay = new Date().getDay();
    const todayIdx = (jsDay + 6) % 7;
    const statuses = Array(7).fill('clear'); statuses[todayIdx] = 'today';
    for (let i = todayIdx + 1; i < 7; i++) statuses[i] = 'not_yet';
    onWeekMeta?.({ todayIdx, statuses });
  }, [onWeekMeta]);

  const { coords } = useLocationCtx();
  const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY || 'b2548e560b21d386e9c1d05c5af41205';
  const { weather, loading, error, refresh } = useWeather({ coords, minIntervalMs: 10*60*1000, apiKey: API_KEY });

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
              <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(error, null, 2)}</pre>
            </details>
            <div style={{ marginTop: 8 }}>온라인 상태: {String(navigator.onLine)}</div>
            <button onClick={refresh} style={{ marginTop: 8 }}>다시 시도</button>
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
                  <img className="icon" alt="weather icon" src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} />
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