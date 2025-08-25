import { useState } from "react";
import clearIcon from "../../assets/WeekStep_Checklist_btn/clear.png";
import notYetIcon from "../../assets/WeekStep_Checklist_btn/not_yet.png";
import todayIcon from "../../assets/WeekStep_Checklist_btn/today.png";
// ...기존 import 유지
import okIcon from "../../assets/WeekStep_Checklist_btn/clear.png";
import failIcon from "../../assets/WeekStep_Checklist_btn/false.png";
// ...나머지 코드는 그대로
import "./AccumulatedBlock.css";

export default function AccumulatedBlock({ week_total = 0 }) {
  // (예시) 포인트 증감 데모 데이터는 유지
  const [deltas] = useState([+120, -30, 0, +50]);

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const jsDay = new Date().getDay(); // 0(일)~6(토)
  const todayIdx = (jsDay + 6) % 7;  // 0(월)~6(일)
  const statuses = days.map((_, i) => (i === todayIdx ? "today" : i > todayIdx ? "not_yet" : "clear"));
  const ICON = { clear: clearIcon, not_yet: notYetIcon, today: todayIcon };

  return (
    <section className="accum-section">
      <div className="accum-header">
        <span className="accum-header__icon" aria-hidden>🗒️</span>
        <h2 className="accum-header__title">누적 기록</h2>
      </div>

      <article className="accum-card weekly-steps">
        <div className="card-head">
          <div className="card-head__left">
            <span className="card-head__icon" aria-hidden>🥾</span>
            <span className="card-head__title">걸음 수</span>
          </div>
        </div>

        <p className="week-total">
          금주 <strong className="accent-number">{week_total.toLocaleString()}</strong> 걸음
        </p>

        {/* 홈과 동일 규칙(오늘: today, 지난 요일: clear, 미도래: not_yet) */}
        <div className="week-grid">
          {statuses.map((s, i) => (
            <img key={i} src={ICON[s]} alt={s} className="status-img" draggable="false" />
          ))}
          {days.map((d) => (
            <span key={d} className="day-label">{d}</span>
          ))}
        </div>

        <div className="divider" />

        {/* 범례(옵션) */}
          <span className="legend-item">
          <img src={okIcon} alt="" className="legend-icon" aria-hidden="true" />
            일 목표 달성
        </span>
        <span className="legend-item">
          <img src={failIcon} alt="" className="legend-icon" aria-hidden="true" />
            일 목표 미달성
        </span>
      </article>

      {/* ▼ 목표 기록 데모(필요 시 유지) */}
      <article className="accum-card goal-list">
        <div className="card-head">
          <div className="card-head__left">
            <span className="card-head__icon" aria-hidden>🔥</span>
            <span className="card-head__title">목표 기록</span>
          </div>
        </div>

        <ul className="goal-items">
          {["월", "화", "수", "목"].map((d, i) => {
            const delta = deltas[i] ?? 0;
            const deltaClass = delta > 0 ? "up" : delta < 0 ? "down" : "zero";
            const deltaText = delta > 0 ? `+${delta}p` : delta < 0 ? `${delta}p` : "±0p";
            return (
              <li className="goal-item" key={d}>
                <span className="col day">{d}</span>
                <span className="col steps">7000 보</span>
                <span className="col minutes">70 분</span>
                <span className="col route">루트</span>
                <span className="col done">
                  <span className={`point-delta ${deltaClass}`} aria-label="포인트 증감">{deltaText}</span>
                  <img src={clearIcon} alt="" className="legend-icon" aria-hidden="true" />
                </span>
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
}