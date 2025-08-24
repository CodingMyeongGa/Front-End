import { useState, useCallback } from "react";
import WeatherDate from "../components/Home/WeatherDate";
import WeekStep from "../components/Home/WeekStep";
import Map from "../components/Home/Map";
import TodayStep from "../components/Home/TodayStep";
import HomeAfterSetRoute from "./HomeAfterSetRoute";
// import { readGoal } from "../hooks/useAutoGoalSession";
import useAutoGoalSession from "../hooks/useAutoGoalSession";



const Home = ({ week_step_total }) => {
  const [weekStatuses, setWeekStatuses] = useState(null);
  const [todayIdx, setTodayIdx] = useState(null);
  // const [goal, setGoal] = useState(readGoal());

  const { goal } = useAutoGoalSession(); // ⬅️ 목표 변경에 반응

  const handleWeekMeta = useCallback(({ todayIdx, statuses }) => {
    setTodayIdx(prev => (prev === todayIdx ? prev : todayIdx));
    setWeekStatuses(prev => {
      if (!prev) return statuses;
      if (prev.length === statuses.length && prev.every((v, i) => v === statuses[i])) return prev;
      return statuses;
    });
  }, []);

  if (goal > 0) return <HomeAfterSetRoute />;

  

  return (
    <div>
      <WeatherDate onWeekMeta={handleWeekMeta} />
      <WeekStep week_step_total={week_step_total} weekStatuses={weekStatuses} todayIdx={todayIdx} />
      <Map />
      <TodayStep />
    </div>
  );
};
export default Home;