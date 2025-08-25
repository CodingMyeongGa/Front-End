import { useState } from "react";
import useAutoGoalSession from "../../hooks/useAutoGoalSession";
import { saveAccumulatedSteps } from "../../services/stepsApi";

const styles = {
  base: { width:'100%', padding:'14px 16px', border:'none', borderRadius:12, fontWeight:800, fontSize:'1rem', cursor:'pointer' },
  start: { background:'#8CE75E', color:'#071648' },
  stop:  { background:'#D26767', color:'#fff' },
  record:{ background:'#8DBE74', color:'#071648' },
};

const todayISO = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
};

function StartStop_btn(){
  const { goal, running, done, start, stop, session, total } = useAutoGoalSession();
  const [saving, setSaving] = useState(false);
  if (goal <= 0) return null;

  const onRecord = async () => {
    if (saving) return;
    const date = session?.date || todayISO();
    const userRaw = sessionStorage.getItem("userId");
    const user_id = userRaw != null ? (Number(userRaw) || userRaw) : undefined;
    const current_steps = Number(total) || 0;
    if (!current_steps) { alert("기록할 걸음 수가 없습니다."); return; }
    setSaving(true);
    try {
      await saveAccumulatedSteps({ user_id, date, current_steps });
      alert("걸음 수가 저장되었습니다.");
      window.dispatchEvent(new Event("local-step:refresh"));
    } catch {
      alert("서버 저장에 실패했습니다(CORS/네트워크).");
    } finally { setSaving(false); }
  };

  let label = '시작하기', style = { ...styles.base, ...styles.start }, handler = start, disabled = false;
  if (running){ label = '중단하기'; style = { ...styles.base, ...styles.stop }; handler = stop; }
  else if (!running && done){ label = saving ? '저장 중…' : '기록하기'; style = { ...styles.base, ...styles.record }; handler = onRecord; disabled = saving; }

  return (
    <div style={{marginTop:'14px'}}>
      <button style={style} onClick={handler} disabled={disabled}>{label}</button>
    </div>
  );
}
export default StartStop_btn;