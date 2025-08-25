import { useState, useCallback, useEffect } from "react";
import WeatherDate from "../components/Home/WeatherDate";
import WeekStep from "../components/Home/WeekStep";
import Map from "../components/Home/Map";
import TodayStep from "../components/Home/TodayStep";
import HomeAfterSetRoute from "./HomeAfterSetRoute";
import useAutoGoalSession, { setGoalForToday, clearGoalAndSession } from "../hooks/useAutoGoalSession";
import { fetchUserGoal, fetchWeeklySteps } from "../services/stepsApi";
import { isAuthed } from "../utils/auth";

const todayISO = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dd}`;
};

/* 월요일 시작 주간 유틸 */
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

const Home = () => {
  const [weekStatuses, setWeekStatuses] = useState(null);
  const [todayIdx, setTodayIdx] = useState(null);
  const { goal } = useAutoGoalSession();
  const [synced, setSynced] = useState(false);
  const [serverGoalToday, setServerGoalToday] = useState(null);
  const [weekTotal, setWeekTotal] = useState(0);

  /* 서버 목표 ↔ 로컬 동기화 (초기 1회) */
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isAuthed()) { if (alive){ setSynced(true); setServerGoalToday(0); } return; }
      const uid = sessionStorage.getItem("userId");
      if (!uid) { if (alive){ setSynced(true); setServerGoalToday(0); } return; }
      try {
        const data = await fetchUserGoal(uid);
        const svGoal = Number(data?.goal_steps) || 0;
        const setDate = data?.set_date;
        if (svGoal > 0 && setDate === todayISO()) {
          setGoalForToday(svGoal, uid);
          if (alive) setServerGoalToday(svGoal);
        } else {
          clearGoalAndSession(uid);
          if (alive) setServerGoalToday(0);
        }
      } catch {
        if (alive) setServerGoalToday(0);
      } finally { if (alive) setSynced(true); }
    })();
    return () => { alive = false; };
  }, []);

  /* 금주 합계(월~어제) */
  useEffect(() => {
    let alive = true;
    (async () => {
      const start = startOfWeek(new Date());
      const end = new Date();
      end.setDate(end.getDate() - 1);
      if (end < start) { if (alive) setWeekTotal(0); return; }
      try {
        const list = await fetchWeeklySteps(ymd(start), ymd(end));
        const sum = (list || []).reduce((a, c) => a + (Number(c.steps) || 0), 0);
        if (alive) setWeekTotal(sum);
      } catch { if (alive) setWeekTotal(0); }
    })();
    return () => { alive = false; };
  }, []);

  /* 홈의 주간 상태 메타 */
  const handleWeekMeta = useCallback(({ todayIdx, statuses }) => {
    setTodayIdx((prev) => (prev === todayIdx ? prev : todayIdx));
    setWeekStatuses((prev) => {
      if (!prev) return statuses;
      if (prev.length === statuses.length && prev.every((v, i) => v === statuses[i])) return prev;
      return statuses;
    });
  }, []);

  /* 목표가 있으면 경로진행 화면 */
  if ((serverGoalToday ?? 0) > 0 || goal > 0) return <HomeAfterSetRoute />;

  /* 최초 로그인 후 자동 리다이렉트 없음 — 홈 유지 */
  return (
    <div>
      <WeatherDate onWeekMeta={handleWeekMeta} />
      <WeekStep week_step_total={weekTotal} weekStatuses={weekStatuses} todayIdx={todayIdx} />
      <Map />
      <TodayStep />
    </div>
  );
};

export default Home;