import { setGoalForToday, clearGoalAndSession } from "../../hooks/useAutoGoalSession";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import "./GoalSwitch.css";

const API_BASE = import.meta.env.VITE_API_BASE;

function GoalSwitch() {
  const navigate = useNavigate();
  const [isOn, setIsOn] = useState(true);
  const [goal, setGoal] = useState(() => {
    const raw = localStorage.getItem('step_goal')
      try{
        const obj = raw ? JSON.parse(raw) : null
        return Number(obj?.value) || 5000
      }catch{ return 5000 }
  });

  const toggle = () => setIsOn(prev => !prev);
  const inc = (n) => setGoal(g => Math.max(0, g + n));
  const dec = (n) => setGoal(g => Math.max(0, g - n));

  useEffect(() => {}, [isOn, goal]);

  const todayISO = () => {
    const d = new Date();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  };

const confirmAndSet = async () => {
  if (!isOn || goal <= 0) { alert('목표 스위치를 켜고 0보다 큰 값으로 설정하세요.'); return }
  const ok = window.confirm(`목표를 ${goal.toLocaleString()}보로 설정하시겠습니까?
한 번 설정 시 달성 시 혹은 다음 날 전까지는 변경할 수 없습니다.`)
  if (!ok) return;

    const payload = { goal_steps: Number(goal), set_date: todayISO() };
    const uid = sessionStorage.getItem('userId');
    if (uid) payload.user_id = Number(uid) || uid;

  const token = getToken();
  try {
    const res = await fetch(`${API_BASE}/api/steps/goal`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("save_failed");
    setGoalForToday(goal, uid);
    navigate("/route-recommend-page");
  } catch {
    setGoalForToday(goal, uid);
    alert("서버 저장에 실패했습니다(CORS/네트워크). 로컬에만 저장되었습니다.");
    navigate("/route-recommend-page");
  }
};

  return (
    <div className="page">
      <button
        className={`goal-switch ${isOn ? "on" : "off"}`}
        onClick={toggle}
      >
        <span className="switch-label">목표 걸음 수</span>
        <span className="switch-knob">
          <span className="knob-text">
            {goal.toLocaleString()}
          </span>
        </span>
      </button>
      <div className="controls">
        <button className="round" onClick={() => dec(1000)}>−1000</button>
        <button className="round" onClick={() => dec(500)}>−500</button>
        <button className="round" onClick={() => inc(500)}>+500</button>
        <button className="round" onClick={() => inc(1000)}>+1000</button>
      </div>
      <button className="round" onClick={confirmAndSet}>목표 설정</button>
    </div>
  );
};

export default GoalSwitch;