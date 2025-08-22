// 실제 전환 시: USE_MOCK = false 로 바꾸고, 아래 fetchWeeklyStepsReal 구현만 채워주면 됨.
const USE_MOCK = true;

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

/**
 * 실서버: API 명세 나오면 여기만 채우면 됨
 * 예시) GET /api/steps?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
async function fetchWeeklyStepsReal(from, to) {
  // import axios from "../util/axios";
  // const res = await axios.get("/api/steps", { params: { from, to } });
  // return res.data;
  return []; // 명세 전이므로 일단 빈 배열
}

export async function fetchWeeklySteps(from, to) {
  return USE_MOCK ? fetchWeeklyStepsMock(from, to) : fetchWeeklyStepsReal(from, to);
}
