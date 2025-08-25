import { useEffect, useState } from "react";
import AccumulatedBlock from "../components/Mypage/AccumulatedBlock";
import Profile from "../components/Mypage/Profile";
import { fetchWeeklySteps } from "../services/stepsApi";

// 주간 범위 유틸(월~일)
const startOfWeek = (d0 = new Date()) => {
  const d = new Date(d0);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};
const ymd = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function Mypage() {
  const [weekTotal, setWeekTotal] = useState(0);

  useEffect(() => {
    let alive = true;
    (async () => {
      const start = startOfWeek(new Date());
      const end = new Date();
      end.setDate(end.getDate() - 1);
      if (end < start) {
        if (alive) setWeekTotal(0);
        return;
      }
      try {
        const list = await fetchWeeklySteps(ymd(start), ymd(end));
        const sum = (list || []).reduce((a, c) => a + (Number(c.steps) || 0), 0);
        if (alive) setWeekTotal(sum);
      } catch {
        if (alive) setWeekTotal(0);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <Profile />
      <AccumulatedBlock week_total={weekTotal} />
    </div>
  );
}