import { setGoalForToday, clearGoalAndSession } from "../../hooks/useAutoGoalSession";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GoalSwitch.css";

const LS_GOAL = 'step_goal'

function GoalSwitch() {
  const navigate = useNavigate();
  const [isOn, setIsOn] = useState(true);
  const [goal, setGoal] = useState(() => {
    const raw = localStorage.getItem('step_goal')
      try{
        const obj = raw ? JSON.parse(raw) : null
        return Number(obj?.value) || 5000 // 기본 목표값 5000보
      }catch{ return 5000 }
  });

  const toggle = () => setIsOn(prev => !prev); 

  const inc = (n) => setGoal(g => Math.max(0, g + n)); //하한선 설정(0)
  const dec = (n) => setGoal(g => Math.max(0, g - n));

  
  useEffect(() => {}, [isOn, goal]);

  // useEffect(() => {
  //   if (isOn && goal > 0) localStorage.setItem(LS_GOAL, String(goal))
  //   else localStorage.removeItem(LS_GOAL)
  // }, [isOn, goal])
  const confirmAndSet = () => {
    if (!isOn || goal <= 0) { alert('목표 스위치를 켜고 0보다 큰 값으로 설정하세요.'); return }
    const ok = window.confirm(`목표를 ${goal.toLocaleString()}보로 설정하시겠습니까?
한 번 설정 시 달성 시 혹은 다음 날 전까지는 변경할 수 없습니다.`)
    if (ok){
      setGoalForToday(goal)       // 오늘 목표 저장(+storage 이벤트 발생)
      navigate('/')              // 홈으로 이동
    }
  }




  // 테스트 후 서비스 전 지우기
  /* ⬇️ 추가: 목표 초기화 버튼 핸들러 */
  const clearAll = () => {
    const ok = window.confirm('오늘 설정된 목표와 진행 중인 세션을 초기화할까요?')
    if (ok){ clearGoalAndSession(); navigate('/') }
  }





  return (
    <div className="page">
      {/* 스위치 */}
      <button
        className={`goal-switch ${isOn ? "on" : "off"}`}
        onClick={toggle}
        // aria-pressed={isOn} //WAI-ARIA 상태 속성
      >
        <span className="switch-label">목표 걸음 수</span>

        {/* 오른쪽 동그란 배지(스위치 노브) 안에 목표 걸음 수 표시 */}
        <span className="switch-knob">
          <span className="knob-text">
            {goal.toLocaleString()}
          </span>
        </span>
      </button>

      {/* 증감컨트롤 */}
      <div className="controls">
        <button className="round" onClick={() => dec(1000)}>−1000</button>
        <button className="round" onClick={() => dec(500)}>−500</button>
        <button className="round" onClick={() => inc(500)}>+500</button>
        <button className="round" onClick={() => inc(1000)}>+1000</button>
      </div>

      {/* 목표 설정 버튼 */}
      <button className="round" onClick={confirmAndSet}>목표 설정</button>

      {/* 테스트 후 서비스 전 지우기 */}
      <button className="round" onClick={clearAll}>목표 초기화</button>

    </div>
  );
};

export default GoalSwitch;

