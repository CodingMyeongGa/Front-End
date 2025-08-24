import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepsList from "../components/Step/StepList";
import Button from "../components/Step/Button";
import "../components/Step/StepsWeekly.css";
import { fetchWeeklySteps } from "../services/stepsApi"; // 모킹/실서버 전환 포인트

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0: Sun
  const diff = (day === 0 ? -6 : 1) - day; // 월요일 기준
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfWeek(date) {
  const s = startOfWeek(date);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
}
function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const StepsWeekly = () => {
  const nav = useNavigate();
  const [pivotDate, setPivotDate] = useState(() => new Date());
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]); // [{id, date, steps}]

  const range = useMemo(() => {
    const s = startOfWeek(pivotDate);
    const e = endOfWeek(pivotDate);
    return { start: s, end: e };
  }, [pivotDate]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchWeeklySteps(ymd(range.start), ymd(range.end));
        if (alive) setSteps(data);
      } catch (e) {
        console.error(e);
        if (alive) setSteps([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [range.start, range.end]);

  const onPrevWeek = () =>
    setPivotDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() - 7);
      return n;
    });

  const onNextWeek = () =>
    setPivotDate((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + 7);
      return n;
    });

  const total = steps.reduce((acc, cur) => acc + (cur.steps || 0), 0);
  const avg = steps.length ? Math.round(total / steps.length) : 0;

  return (
    <div className="StepsWeekly page">
      <header className="steps_header">
        <h2>주간 걸음 수</h2>
        <div className="range">
          {ymd(range.start)} ~ {ymd(range.end)}
        </div>
        <div className="summary">
          <div className="pill">주간 합계: {total.toLocaleString()} 걸음</div>
          <div className="pill">평균: {avg.toLocaleString()} 걸음</div>
        </div>
        <div className="actions">
          <Button onClick={onPrevWeek} text="이전 주" />
          <Button onClick={onNextWeek} text="다음 주" />
          <Button onClick={() => nav("/")} text="홈으로" type="NEGATIVE" />
        </div>
      </header>

      {loading ? (
        <div className="steps_loading">불러오는 중...</div>
      ) : (
        <StepsList data={steps} />
      )}
    </div>
  );
};

export default StepsWeekly;
