import './TodayStep.css';
import useAutoGoalSession from '../../hooks/useAutoGoalSession';

export default function TodayStep(){
  const { goal, total } = useAutoGoalSession()
  const hasGoal = goal > 0
  const pct = hasGoal ? Math.min(100, (total / goal) * 100) : 0
  const pctText = `${pct.toFixed(1)}%`
  const goalText = hasGoal ? `목표: ${goal.toLocaleString()}보` : '오늘의 목표 미정'

  return (
    <section className="todaystep" aria-label="오늘 걸음 현황">
      <div className="ts-row">
        <span className="ts-left">걸음 수: {total.toLocaleString()}보</span>
        <span className={`ts-right ${hasGoal ? '' : 'missing'}`}>{goalText}</span>
      </div>
      <div className="ts-bar" role="progressbar" aria-valuemin={0} aria-valuemax={hasGoal ? goal : 0} aria-valuenow={hasGoal ? total : 0}>
        <div className="ts-fill" style={{ width: hasGoal ? `${pct}%` : '0%' }} />
        <div className="ts-label">{pctText}</div>
      </div>
    </section>
  )
}