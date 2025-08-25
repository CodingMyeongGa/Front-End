import { useEffect, useMemo, useRef, useState } from 'react'
import usePedometer from './usePedometer'

// per-user keys
const todayKey = () => {
  const d = new Date()
  const mm = String(d.getMonth()+1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  return `${d.getFullYear()}-${mm}-${dd}`
}
const getUID = () => {
  const raw = sessionStorage.getItem('userId')
  return raw != null ? (Number(raw) || raw) : 'anon'
}
const goalKey = (uid=getUID()) => `step_goal:${uid}`
const sessionKey = (uid=getUID()) => `step_session:${uid}`

export function readGoal(uid=getUID()){
  try{
    const raw = localStorage.getItem(goalKey(uid))
    if (!raw) return 0
    const obj = JSON.parse(raw)
    if (!obj?.value || obj?.date !== todayKey()){
      localStorage.removeItem(goalKey(uid))
      return 0
    }
    return Number(obj.value) > 0 ? Number(obj.value) : 0
  }catch{
    localStorage.removeItem(goalKey(uid)); return 0
  }
}

export function setGoalForToday(value, uid=getUID()){
  const v = Number(value) || 0
  if (v > 0){
    localStorage.setItem(goalKey(uid), JSON.stringify({ value: v, date: todayKey() }))
  }else{
    localStorage.removeItem(goalKey(uid))
  }
  window.dispatchEvent(new Event('local-step:goal-change'))
  window.dispatchEvent(new StorageEvent('storage', { key: goalKey(uid) }))
}

export function clearGoalAndSession(uid=getUID()){
  localStorage.removeItem(goalKey(uid))
  localStorage.removeItem(sessionKey(uid))
  window.dispatchEvent(new Event('local-step:goal-change'))
  window.dispatchEvent(new Event('local-step:refresh'))
  window.dispatchEvent(new StorageEvent('storage', { key: goalKey(uid) }))
  window.dispatchEvent(new StorageEvent('storage', { key: sessionKey(uid) }))
}

export default function useAutoGoalSession(){
  const uid = getUID()
  const { steps } = usePedometer({ useGenericSensor: true })
  const [goal, setGoal] = useState(readGoal(uid))
  const [session, setSession] = useState(() => {
    try{ const s = JSON.parse(localStorage.getItem(sessionKey(uid))||'null'); return s || null }catch{ return null }
  })
  const baseSet = useRef(false)

  useEffect(() => {
    const onStorage = (e) => {
      if (!e || e.key === goalKey(uid)) setGoal(readGoal(uid))
      if (!e || e.key === sessionKey(uid)){
        try{
          const s = JSON.parse(localStorage.getItem(sessionKey(uid))||'null')
          setSession(s || null); baseSet.current = !!(s && s.base)
        }catch{ setSession(null); baseSet.current = false }
      }
    }
    const onGoalChange = () => setGoal(readGoal(uid))
    const onRefresh = () => { setGoal(readGoal(uid)); setSession(null); baseSet.current = false }
    window.addEventListener('storage', onStorage)
    window.addEventListener('local-step:goal-change', onGoalChange)
    window.addEventListener('local-step:refresh', onRefresh)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('local-step:goal-change', onGoalChange)
      window.removeEventListener('local-step:refresh', onRefresh)
    }
  }, [uid])

  useEffect(() => {
    const id = setInterval(() => {
      const today = todayKey()
      if (session && session.date !== today){
        setSession(null); localStorage.removeItem(sessionKey(uid)); baseSet.current = false
      }
      const g = readGoal(uid)
      if (g !== goal) setGoal(g)
    }, 60*1000)
    return () => clearInterval(id)
  }, [session, goal, uid])

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
      setSession(done); localStorage.setItem(sessionKey(uid), JSON.stringify(done))
    }else{
      const live = { ...session, total: t, done:false }
      setSession(live); localStorage.setItem(sessionKey(uid), JSON.stringify(live))
    }
  }, [liveTotal, goal, session, uid])

  const start = () => {
    if (goal <= 0) return
    const key = todayKey()
    const s = { date:key, startedAt: Date.now(), base: steps, total: 0, running:true, done:false }
    baseSet.current = true
    setSession(s); localStorage.setItem(sessionKey(uid), JSON.stringify(s))
    window.dispatchEvent(new StorageEvent('storage', { key: sessionKey(uid) }))
  }
  const stop = () => {
    if (!session) return
    const s = { ...session, running:false }
    setSession(s); localStorage.setItem(sessionKey(uid), JSON.stringify(s))
    window.dispatchEvent(new StorageEvent('storage', { key: sessionKey(uid) }))
  }

  return { goal, session, total: session?.total || 0, running: !!session?.running, done: !!session?.done, start, stop }
}