import { useEffect, useState } from "react";
import clearIcon from "../../assets/WeekStep_Checklist_btn/clear.png";
import notYetIcon from "../../assets/WeekStep_Checklist_btn/not_yet.png";
import todayIcon from "../../assets/WeekStep_Checklist_btn/today.png";
import okIcon from "../../assets/WeekStep_Checklist_btn/clear.png";
import failIcon from "../../assets/WeekStep_Checklist_btn/false.png";
import { fetchWeeklySteps, fetchPointsHistory } from "../../services/stepsApi";
import "./AccumulatedBlock.css";

export default function AccumulatedBlock({ week_total = 0 }) {
  const days = ["월","화","수","목","금","토","일"];
  const jsDay = new Date().getDay();
  const todayIdx = (jsDay + 6) % 7;
  const statuses = days.map((_, i) => (i === todayIdx ? "today" : i > todayIdx ? "not_yet" : "clear"));
  const ICON = { clear: clearIcon, not_yet: notYetIcon, today: todayIcon };

  const [rows, setRows] = useState([]);

  const ymd = (d) => {
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${dd}`;
  };
  const startOfWeek = (d0=new Date()) => {
    const d = new Date(d0); const day = d.getDay(); const diff = (day===0?-6:1)-day;
    d.setDate(d.getDate()+diff); d.setHours(0,0,0,0); return d;
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      const start = startOfWeek(new Date());
      const end = new Date(); end.setDate(end.getDate()-1); end.setHours(0,0,0,0);
      if (end < start) { if (alive) setRows([]); return; }

      const [stepList, pointList] = await Promise.allSettled([
        fetchWeeklySteps(ymd(start), ymd(end)),
        fetchPointsHistory(undefined, ymd(start), ymd(end)),
      ]);

      const stepsArr = stepList.status === "fulfilled" ? stepList.value : [];
      const pointsArr = pointList.status === "fulfilled" ? pointList.value : [];

      const mapSteps = new Map(); // date -> {walked, goal}
      stepsArr.forEach(({ date, steps, goal_steps }) => mapSteps.set(date, { walked:Number(steps)||0, goal:Number(goal_steps)||0 }));

      const mapPts = new Map();   // date -> sum points
      pointsArr.forEach(({ created_at, points }) => {
        const d = new Date(created_at); const k = ymd(d);
        mapPts.set(k, (mapPts.get(k)||0) + (Number(points)||0));
      });

      const out = [];
      const cur = new Date(start);
      while (cur <= end){
        const k = ymd(cur);
        const weekdayIdx = (cur.getDay()+6)%7; // 0=월
        const label = days[weekdayIdx];
        const s = mapSteps.get(k) || { walked:0, goal:0 };
        const minutes = Math.round((s.walked || 0) / 100); // 100 spm 가정
        const earned = mapPts.get(k) || 0;
        out.push({ date:k, label, goal:s.goal, walked:s.walked, minutes, points:earned });
        cur.setDate(cur.getDate()+1);
      }
      if (alive) setRows(out);
    })();
    return () => { alive = false; };
  }, []);

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

        <div className="week-grid">
          {statuses.map((s, i) => (
            <img key={i} src={ICON[s]} alt={s} className="status-img" draggable="false" />
          ))}
          {days.map((d) => (
            <span key={d} className="day-label">{d}</span>
          ))}
        </div>

        <div className="divider" />

        <span className="legend-item">
          <img src={okIcon} alt="" className="legend-icon" aria-hidden="true" />
          일 목표 달성
        </span>
        <span className="legend-item">
          <img src={failIcon} alt="" className="legend-icon" aria-hidden="true" />
          일 목표 미달성
        </span>
      </article>

      <article className="accum-card goal-list">
        <div className="card-head">
          <div className="card-head__left">
            <span className="card-head__icon" aria-hidden>🔥</span>
            <span className="card-head__title">목표 기록</span>
          </div>
        </div>

        <ul className="goal-items">
          {rows.length === 0 ? (
            <li className="goal-item" style={{justifyContent:'center'}}>표시할 기록이 없습니다.</li>
          ) : rows.map(({ date, label, goal, walked, minutes, points }) => {
              const ptText = (points>=0?`+${points}`:String(points)) + "p";
              return (
                <li className="goal-item" key={date}>
                  <span className="col day">{label}</span>
                  <span className="col steps">{(goal||0).toLocaleString()} 보 / {(walked||0).toLocaleString()} 보</span>
                  <span className="col minutes">{minutes} 분</span>
                  <span className="col points">{ptText}</span>
                  <span className="col done">
                    <img src={okIcon} alt="완료" className="legend-icon" aria-hidden="true" />
                  </span>
                </li>
              );
          })}
        </ul>
      </article>
    </section>
  );
}