import { useEffect, useMemo, useRef, useState } from 'react'
import usePedometer from './usePedometer'

const LS_GOAL = 'step_goal'
const LS_SESSION = 'step_session' // {date, startedAt, base, total, running, done}

const todayKey = () => {
  const d = new Date()
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

export function readGoal(){
  try{
    const raw = localStorage.getItem(LS_GOAL)
    if (!raw) return 0
    const obj = JSON.parse(raw)
    if (!obj?.value || obj?.date !== todayKey()){
      localStorage.removeItem(LS_GOAL)
      return 0
    }
    return Number(obj.value) > 0 ? Number(obj.value) : 0
  }catch{
    localStorage.removeItem(LS_GOAL); return 0
  }
}

export function setGoalForToday(value){
  if (Number(value) > 0){
    localStorage.setItem(LS_GOAL, JSON.stringify({ value: Number(value), date: todayKey() }))
    window.dispatchEvent(new StorageEvent('storage', { key: LS_GOAL }))
  }else{
    localStorage.removeItem(LS_GOAL)
    window.dispatchEvent(new StorageEvent('storage', { key: LS_GOAL }))
  }
}

/* 테스트용 초기화(원하면 그대로 유지) */
export function clearGoalAndSession(){
  localStorage.removeItem(LS_GOAL)
  localStorage.removeItem(LS_SESSION)
  window.dispatchEvent(new StorageEvent('storage', { key: LS_GOAL }))
  window.dispatchEvent(new StorageEvent('storage', { key: LS_SESSION }))
  window.dispatchEvent(new Event('local-step:refresh'))
}

export default function useAutoGoalSession(){
  const { steps } = usePedometer({ useGenericSensor: true })
  const [goal, setGoal] = useState(readGoal())
  const [session, setSession] = useState(() => {
    try{ const s = JSON.parse(localStorage.getItem(LS_SESSION)||'null'); return s || null }catch{ return null }
  })
  const baseSet = useRef(false)

  // storage & refresh 이벤트 수신
  useEffect(() => {
    const onStorage = (e) => {
      if (!e || e.key === LS_GOAL) setGoal(readGoal())
      if (!e || e.key === LS_SESSION){
        try{
          const s = JSON.parse(localStorage.getItem(LS_SESSION)||'null')
          setSession(s || null); baseSet.current = !!(s && s.base)
        }catch{ setSession(null); baseSet.current = false }
      }
    }
    const onRefresh = () => { setGoal(readGoal()); setSession(null); baseSet.current = false }
    window.addEventListener('storage', onStorage)
    window.addEventListener('local-step:refresh', onRefresh)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('local-step:refresh', onRefresh)
    }
  }, [])

  // ⬇️ 자동 시작 제거: 목표가 있어도 세션은 시작하지 않음. 시작 버튼에서 start() 호출 필요
  // 날짜 넘어가면 세션/목표 동기화
  useEffect(() => {
    const id = setInterval(() => {
      const today = todayKey()
      if (session && session.date !== today){
        setSession(null); localStorage.removeItem(LS_SESSION); baseSet.current = false
      }
      const g = readGoal()
      if (g !== goal) setGoal(g)
    }, 60*1000)
    return () => clearInterval(id)
  }, [session, goal])

  // 진행 중일 때에만 실시간 합산
  const liveTotal = useMemo(() => {
    if (!session?.running || !baseSet.current) return session?.total || 0
    return Math.max(0, steps - session.base)
  }, [steps, session?.running, session?.total, session?.base])

  useEffect(() => {
    if (!session?.running) return
    const t = liveTotal
    if (!Number.isFinite(t)) return
    if (goal > 0 && t >= goal){
      const done = { ...session, total: goal, running:false, done:true, endedAt: Date.now() }
      setSession(done); localStorage.setItem(LS_SESSION, JSON.stringify(done))
    }else{
      const live = { ...session, total: t, done:false }
      setSession(live); localStorage.setItem(LS_SESSION, JSON.stringify(live))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveTotal, goal])

  // ⬇️ 컨트롤러: 시작/중단
  const start = () => {
    if (goal <= 0) return
    const key = todayKey()
    const s = { date:key, startedAt: Date.now(), base: steps, total: 0, running:true, done:false }
    baseSet.current = true
    setSession(s); localStorage.setItem(LS_SESSION, JSON.stringify(s))
    window.dispatchEvent(new StorageEvent('storage', { key: LS_SESSION }))
  }
  const stop = () => {
    if (!session) return
    const s = { ...session, running:false }
    setSession(s); localStorage.setItem(LS_SESSION, JSON.stringify(s))
    window.dispatchEvent(new StorageEvent('storage', { key: LS_SESSION }))
  }

  return { 
    goal, 
    session, 
    total: session?.total || 0, 
    running: !!session?.running, 
    done: !!session?.done,
    start, 
    stop 
  }
}