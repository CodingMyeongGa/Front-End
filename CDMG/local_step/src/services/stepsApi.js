import { getToken } from "../utils/auth";
const API_BASE = "http://43.201.15.212:8080";

// 실제 전환 시: USE_MOCK = false 로 바꾸고, 아래 fetchWeeklyStepsReal 구현만 채워주면 됨.
const USE_MOCK = false;

const todayISO = (d=new Date()) => {
  const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0')
  return `${y}-${m}-${dd}`
}

/**
 * 모킹: from~to에 해당하는 일주일 더미 데이터 생성 후 600ms 지연 반환
 * @param {string} from YYYY-MM-DD
 * @param {string} to   YYYY-MM-DD
 */
async function fetchWeeklyStepsMock(from, to) {
  const start = new Date(from);
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const iso = `${yyyy}-${mm}-${dd}`;
    // 랜덤 걸음 수: 3,000 ~ 13,000
    const steps = Math.floor(3000 + Math.random() * 10000);
    return { id: Number(`${yyyy}${mm}${dd}`), date: iso, steps };
  });
  await new Promise((r) => setTimeout(r, 600));
  return days;
}

async function fetchWeeklyStepsReal(from, to) {
  const token = getToken();
  const raw = sessionStorage.getItem("userId");
  const user_id = raw != null ? (Number(raw) || raw) : null;
  if (user_id == null) return [];
  const url = new URL(`${API_BASE}/api/steps/history/${user_id}`);
  url.searchParams.set("startDate", from);
  url.searchParams.set("endDate", to);
  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("GET_HISTORY_FAILED");
  const data = await res.json().catch(() => ({}));
  const items = Array.isArray(data?.items) ? data.items : [];
  return items.map(({ date, current_steps, goal_steps }) => ({
    id: Number(String(date).replaceAll("-", "")) || Date.now(),
    date,
    steps: Number(current_steps) || 0,
    goal_steps: Number(goal_steps) || 0,
  }));
}

export async function fetchWeeklySteps(from, to) {
  return USE_MOCK ? fetchWeeklyStepsMock(from, to) : fetchWeeklyStepsReal(from, to);
}

export async function putAccumulatedSteps(user_id, { date, current_steps }) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/steps/data/${user_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ date, current_steps }),
  });
  if (!res.ok) throw new Error("PUT_FAILED");
  return res.json().catch(() => ({}));
}

export async function postAccumulatedSteps({ user_id, date, current_steps }) {
  const token = getToken();
  const payload = { date, current_steps, ...(user_id != null ? { user_id } : {}) };
  const res = await fetch(`${API_BASE}/api/steps/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("POST_FAILED");
  return res.json().catch(() => ({}));
}

/** 스웨거 명세 준수 저장: user_id 있으면 PUT, 실패 시 POST로 폴백. 없으면 POST */
export async function saveAccumulatedSteps({ user_id, date, current_steps }) {
  if (user_id != null && user_id !== "")
    try { return await putAccumulatedSteps(user_id, { date, current_steps }); }
    catch { /* fallthrough to POST */ }
  return postAccumulatedSteps({ user_id, date, current_steps });
}

/* (선택) 현재 목표 조회: GET /api/steps/goal/{user_id} */
export async function fetchUserGoal(userId) {
  const token = getToken();
  const id = userId ?? (Number(sessionStorage.getItem("userId")) || sessionStorage.getItem("userId"));
  if (id == null) throw new Error("NO_USER_ID");
  const res = await fetch(`${API_BASE}/api/steps/goal/${id}`, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok) throw new Error("GET_GOAL_FAILED");
  return res.json();
}

export async function fetchUserPointsBalance(userId){
  const token = getToken();
  const id = userId ?? (Number(sessionStorage.getItem("userId")) || sessionStorage.getItem("userId"));
  if (id == null) throw new Error("NO_USER_ID");
  const res = await fetch(`${API_BASE}/api/users/${id}/points/balance`, {
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  if (!res.ok){
    if (res.status === 401 || res.status === 404) return { user_id: id, total_points: 0 };
    throw new Error("GET_POINTS_FAILED");
  }
  return res.json();
}


export async function fetchWeekTotalExclToday() {
  const ymd = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0: Sun
    const diff = (day === 0 ? -6 : 1) - day; // Monday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const today = new Date();
  const start = startOfWeek(today);
  const end = new Date(today);
  end.setDate(today.getDate() - 1);
  end.setHours(23, 59, 59, 999);

  if (end < start) return 0; // 월요일이면 0

  const rows = await fetchWeeklySteps(ymd(start), ymd(end));
  return (rows || []).reduce((sum, r) => sum + (Number(r.steps) || 0), 0);
}

export async function fetchPointsHistory(userId, startDate, endDate){
  const token = getToken();
  const id = userId ?? (Number(sessionStorage.getItem("userId")) || sessionStorage.getItem("userId"));
  if (id == null) throw new Error("NO_USER_ID");
  const url = new URL(`${API_BASE}/api/users/${id}/points/history`);
  if (startDate) url.searchParams.set("start_date", startDate);
  if (endDate)   url.searchParams.set("end_date", endDate);
  const res = await fetch(url.toString(), {
    headers: { "Content-Type":"application/json", ...(token ? { Authorization:`Bearer ${token}` } : {}) }
  });
  if (!res.ok){
    if ([400,401,404].includes(res.status)) return [];
    throw new Error("GET_POINTS_HISTORY_FAILED");
  }
  const data = await res.json().catch(()=>[]);
  return Array.isArray(data) ? data : [data];
}

export async function resetUserGoal(userId){
  const token = getToken()
  const id = Number(userId) || userId
  if (!id) throw new Error("NO_USER_ID")

  // 1) 서버가 DELETE 지원 시 시도
  try{
    const del = await fetch(`${API_BASE}/api/steps/goal/${id}`, {
      method: "DELETE",
      headers: { ...(token ? { Authorization:`Bearer ${token}` } : {}) },
    })
    if (del.ok) return del.json().catch(()=> ({}))
    // 405/404일 경우만 계속 진행
    if (![404,405].includes(del.status)) throw new Error(`DELETE_${del.status}`)
  }catch{ /* fallthrough */ }

  // 2) 미지원이면 goal_steps=0으로 재설정(POST)
  const res = await fetch(`${API_BASE}/api/steps/goal`, {
    method: "POST",
    headers: { "Content-Type":"application/json", ...(token ? { Authorization:`Bearer ${token}` } : {}) },
    body: JSON.stringify({ user_id: id, goal_steps: 0, set_date: todayISO() })
  })
  if (!res.ok) throw new Error("RESET_GOAL_FAILED")
  return res.json().catch(() => ({}))
}