import useAutoGoalSession from "../../hooks/useAutoGoalSession"

const styles = {
  base: { width:'100%', padding:'14px 16px', border:'none', borderRadius:12, fontWeight:800, fontSize:'1rem', cursor:'pointer' },
  start: { background:'#8CE75E', color:'#071648' },
  stop:  { background:'#D26767', color:'#fff' },
  record:{ background:'#8DBE74', color:'#071648' },
}

function StartStop_btn(){ 
  const { goal, running, done, start, stop } = useAutoGoalSession()
  if (goal <= 0) return null

  // 상태 결정
  let label = '시작하기', style = { ...styles.base, ...styles.start }, handler = start
  if (running){ label = '중단하기'; style = { ...styles.base, ...styles.stop }; handler = stop }
  else if (!running && done){ label = '기록하기'; style = { ...styles.base, ...styles.record }; handler = () => {/* TODO: 기록 저장 로직 연결 */} }

  return (
    <div style={{marginTop:'14px'}}>
      <button style={style} onClick={handler}>{label}</button>
    </div>
  )
}
export default StartStop_btn; 