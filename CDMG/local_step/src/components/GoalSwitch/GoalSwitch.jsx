import { setGoalForToday, clearGoalAndSession } from "../../hooks/useAutoGoalSession";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetUserGoal } from "../../services/stepsApi"; // ⬅️ 추가

import { getToken } from "../../utils/auth";
import "./GoalSwitch.css";

// const LS_GOAL = 'step_goal'
const API_BASE = "http://43.201.15.212:8080";

async function ensureUserId(token){
  let uid = sessionStorage.getItem("userId");
  if (!uid && token){
    try{
      const r = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok){
        const me = await r.json().catch(()=>null);
        if (me?.id != null){ uid = me.id; sessionStorage.setItem("userId", uid); }
      }
    }catch{}
  }
  return uid != null ? (Number(uid) || uid) : undefined;
}

// 여러 스펙 대응(POST /goal, PUT /goal/{id}, POST /goal/{id})
async function saveGoalOnServer({ token, user_id, goal_steps, set_date }){
  const headers = { "Content-Type":"application/json", ...(token ? { Authorization:`Bearer ${token}` } : {}) };
  const tryFetch = async (url, method, body) => {
    const r = await fetch(url, { method, headers, body: JSON.stringify(body) });
    if (!r.ok) { const t = await r.text().catch(()=> ""); const err = new Error(t || `${r.status}`); err.status=r.status; throw err; }
    return r;
  };
  try {
    return await tryFetch(`${API_BASE}/api/steps/goal`, "POST", { user_id, goal_steps, set_date });
  } catch (e1) {
    if (![403,404,405].includes(e1.status)) throw e1;
    try {
      return await tryFetch(`${API_BASE}/api/steps/goal/${user_id}`, "PUT", { goal_steps, set_date });
    } catch (e2) {
      if (![403,404,405].includes(e2.status)) throw e2;
      return await tryFetch(`${API_BASE}/api/steps/goal/${user_id}`, "POST", { goal_steps, set_date });
    }
  }
}

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

  const todayISO = () => {
    const d = new Date();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  };

  // useEffect(() => {
  //   if (isOn && goal > 0) localStorage.setItem(LS_GOAL, String(goal))
  //   else localStorage.removeItem(LS_GOAL)
  // }, [isOn, goal])
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
    const res = await fetch("http://43.201.15.212:8080/api/steps/goal", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("save_failed");
    setGoalForToday(goal, uid); // ⬅️ 사용자별 저장
    navigate("/route-recommend-page"); // ⬅️ 변경
  } catch {
    setGoalForToday(goal, uid);
    alert("서버 저장에 실패했습니다(CORS/네트워크). 로컬에만 저장되었습니다.");
    navigate("/route-recommend-page");
  }
};




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



    </div>
  );
};

export default GoalSwitch;

