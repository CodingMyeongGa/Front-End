import { useState } from "react";
import "./GoalSwitch.css";

function GoalSwitch() {
  const [isOn, setIsOn] = useState(true);
  const [goal, setGoal] = useState(7000); // 목표 걸음 수

  const toggle = () => setIsOn(prev => !prev); 

  const inc = (n) => setGoal(g => Math.max(0, g + n)); //하한선 설정(0)
  const dec = (n) => setGoal(g => Math.max(0, g - n));

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
    </div>
  );
};

export default GoalSwitch;

