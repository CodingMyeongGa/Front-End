
// import "./AccumulatedBlock.css";

// export default function AccumulatedBlock() {
//   return (
//     <section className="accum-section">
//       {/* 헤더 */}
//       <div className="accum-header">
//         <span className="accum-header__icon" aria-hidden>🗒️</span>
//         <h2 className="accum-header__title">누적 기록</h2>
//       </div>

//       {/* 카드: 걸음 수 */}
//       <article className="accum-card weekly-steps">
//         <div className="card-head">
//           <div className="card-head__left">
//             <span className="card-head__icon" aria-hidden>🥾</span>
//             <span className="card-head__title">걸음 수</span>
//           </div>
//         </div>

//         <p className="week-total">
//           금주 <strong className="accent-number">49,000</strong> 걸음
//         </p>

//         {/* 요일별 상태 */}
//         <div className="week-grid">
//           {/* 상태 아이콘 7개 */}
//           <span className="status-dot ok">✓</span>
//           <span className="status-dot fail">✕</span>
//           <span className="status-dot ok">✓</span>
//           <span className="status-dot ok">✓</span>
//           <span className="status-dot ok">✓</span>
//           <span className="status-dot ok">✓</span>
//           <span className="status-dot ok">✓</span>

//           {/* 요일 라벨 7개 */}
//           <span className="day-label">월</span>
//           <span className="day-label">화</span>
//           <span className="day-label">수</span>
//           <span className="day-label">목</span>
//           <span className="day-label">금</span>
//           <span className="day-label">토</span>
//           <span className="day-label">일</span>
//         </div>

//         <div className="divider" />

//         {/* 범례 */}
//         <div className="legend">
//           <span className="legend-item">
//             <span className="status-dot ok sm">✓</span> 일 목표 달성
//           </span>
//           <span className="legend-item">
//             <span className="status-dot fail sm">✕</span> 일 목표 미달성
//           </span>
//         </div>
//       </article>

//       {/* 카드: 목표 기록 (리스트 틀만) */}
//       <article className="accum-card goal-list">
//         <div className="card-head">
//           <div className="card-head__left">
//             <span className="card-head__icon" aria-hidden>🔥</span>
//             <span className="card-head__title">목표 기록</span>
//           </div>
//         </div>

//         <ul className="goal-items">
//           {["월", "화", "수", "목"].map((d) => (
//             <li className="goal-item" key={d}>
//               <span className="col day">{d}</span>
//               <span className="col steps">7000 보</span>
//               <span className="col minutes">70 분</span>
//               <span className="col route">걸은 루트</span>
//               <span className="col done">
//                 <span className="status-dot ok">✓</span>
//               </span>
//             </li>
//           ))}
//         </ul>
//       </article>
//     </section>
//   );
// }

import okIcon from "../../assets/WeekStep_Checklist_btn/clear.png";
import failIcon from "../../assets/WeekStep_Checklist_btn/false.png";
import { useEffect, useState } from "react";
import "./AccumulatedBlock.css";


export default function AccumulatedBlock() {
  // ▷ 증감값: 요일 순서에 맞춰 배열로 저장 (예: 월~목만 사용)
  const [deltas, setDeltas] = useState([+120, -30, 0, +50]); // 기본 값
  const weekStates = ["ok","fail","ok","ok","ok","ok","ok"];

  return (
    <section className="accum-section">
      {/* 헤더 */}
      <div className="accum-header">
        <span className="accum-header__icon" aria-hidden>🗒️</span>
        <h2 className="accum-header__title">누적 기록</h2>
      </div>

      {/* 카드: 걸음 수 */}
      <article className="accum-card weekly-steps">
        <div className="card-head">
          <div className="card-head__left">
            <span className="card-head__icon" aria-hidden>🥾</span>
            <span className="card-head__title">걸음 수</span>
          </div>
        </div>

        <p className="week-total">
          금주 <strong className="accent-number">49,000</strong> 걸음
        </p>

         <div className="week-grid">
        {weekStates.map((st, i) => (
          <img
            key={i}
            src={st === "ok" ? okIcon : failIcon}
            alt={st === "ok" ? "일 목표 달성" : "일 목표 미달성"}
            className="status-img"
            draggable="false"
          />
        ))}

        {/* 요일 라벨 7개 */}
        <span className="day-label">월</span>
        <span className="day-label">화</span>
        <span className="day-label">수</span>
        <span className="day-label">목</span>
        <span className="day-label">금</span>
        <span className="day-label">토</span>
        <span className="day-label">일</span>
      </div>
        <div className="divider" />

        {/* 범례 */}
        <span className="legend-item">
          <img src={okIcon} alt="" className="legend-icon" aria-hidden="true" />
            일 목표 달성
        </span>
        <span className="legend-item">
          <img src={failIcon} alt="" className="legend-icon" aria-hidden="true" />
            일 목표 미달성
        </span>
      </article>

      {/* 카드: 목표 기록 */}
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

                {/* ▶ 체크 아이콘 왼쪽에 증감 배지 */}
                <span className="col done">
                  <span className={`point-delta ${deltaClass}`} aria-label="포인트 증감">
                    {deltaText}
                  </span>
                  <img src={okIcon} alt="" className="legend-icon" aria-hidden="true" />
                </span>
              </li>
            );
          })}
        </ul>
      </article>
    </section>
  );
}
